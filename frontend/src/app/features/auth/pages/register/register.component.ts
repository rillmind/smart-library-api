import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  translationService = inject(TranslationService);

  registerForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Apenas números
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Formata o valor visualmente para o input
    let formatted = value;
    if (value.length > 3) {
      formatted = value.substring(0, 3) + '.' + value.substring(3);
    }
    if (value.length > 6) {
      formatted = formatted.substring(0, 7) + '.' + formatted.substring(7);
    }
    if (value.length > 9) {
      formatted = formatted.substring(0, 11) + '-' + formatted.substring(11);
    }
    
    input.value = formatted;
    // O FormControl guarda o CPF cru/limpo
    this.registerForm.get('cpf')?.setValue(value, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const { nome, email, cpf, password } = this.registerForm.value;

    this.authService.register(nome, email, cpf, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Cadastro realizado com sucesso! Faça login para continuar.', 'Fechar', { duration: 4000 });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error || 'Erro ao realizar cadastro. Tente novamente.', 'Fechar', { duration: 5000 });
      }
    });
  }
}
