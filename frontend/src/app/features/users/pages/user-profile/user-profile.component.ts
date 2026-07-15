import { Component, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { User, USER_TYPE_LABELS } from '../../../../core/models/user.model';
import { Loan, LOAN_STATUS_LABELS } from '../../../../core/models/loan.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanService } from '../../../../core/services/loan.service';
import { UserService } from '../../../../core/services/user.service';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  authService = inject(AuthService);
  private loanService = inject(LoanService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  translationService = inject(TranslationService);

  user = signal<User | null>(null);
  userLoans = signal<Loan[]>([]);
  userStats = signal({ totalLoans: 0, activeLoans: 0, overdueLoans: 0, returnedLoans: 0 });

  typeLabels = USER_TYPE_LABELS;
  statusLabels: Record<string, string> = LOAN_STATUS_LABELS;
  displayedColumns = ['bookTitle', 'loanDate', 'dueDate', 'returnDate', 'status'];

  editProfileForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    currentPassword: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    newPassword: new FormControl(''),
  });

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.loanService.getLoansByUserId(currentUser.id).subscribe((loans) => {
        this.userLoans.set(loans);
        const totalLoans = loans.length;
        const activeLoans = loans.filter((l) => l.status === 'ACTIVE').length;
        const overdueLoans = loans.filter((l) => l.status === 'OVERDUE').length;
        const returnedLoans = loans.filter((l) => l.status === 'RETURNED').length;
        this.userStats.set({ totalLoans, activeLoans, overdueLoans, returnedLoans });
      });
    }
  }

  formatCpf(cpf: string): string {
    if (!cpf) return '';
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return cpf;
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'status-badge--active',
      RETURNED: 'status-badge--returned',
      OVERDUE: 'status-badge--overdue',
      RESERVED: 'status-badge--reserved',
    };
    return map[status] || '';
  }

  openEditProfile(template: TemplateRef<any>): void {
    const currentUser = this.user();
    if (currentUser) {
      this.editProfileForm.patchValue({
        name: currentUser.name,
        email: currentUser.email,
        currentPassword: '',
        newPassword: '',
      });
      this.dialog.open(template, {
        width: '450px',
        panelClass: 'custom-dialog-container',
      });
    }
  }

  submitEditProfile(): void {
    if (this.editProfileForm.invalid) return;

    const currentUser = this.user();
    if (currentUser) {
      const { name, email, currentPassword, newPassword } = this.editProfileForm.getRawValue();

      // Valida a senha atual fazendo uma tentativa de login síncrona
      this.authService.login(currentUser.email, currentPassword).subscribe({
        next: () => {
          // Senha válida! Prossegue com a atualização de dados
          const updatedData: any = {
            nome: name,
            email,
            cpf: currentUser.id,
          };
          if (newPassword) {
            updatedData.password = newPassword;
          }

          this.userService.updateUser(currentUser.id, updatedData).subscribe(() => {
            const updatedUser = { ...currentUser, name, email };
            this.authService.currentUser.set(updatedUser);
            this.user.set(updatedUser);
            this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialog.closeAll();
          });
        },
        error: () => {
          this.snackBar.open('Senha atual incorreta! Acesso negado.', 'Fechar', { duration: 4000 });
        }
      });
    }
  }
}
