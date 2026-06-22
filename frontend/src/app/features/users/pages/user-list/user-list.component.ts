import { Component, OnInit, signal, TemplateRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MockDataService } from '../../../../shared/services/mock-data.service';
import { User, USER_TYPE_LABELS } from '../../../../core/models/user.model';
import { Library } from '../../../../core/models/library.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);
  libraries = signal<Library[]>([]);
  displayedColumns: string[] = ['name', 'enrollment', 'email', 'type', 'status', 'actions'];
  typeLabels: Record<string, string> = USER_TYPE_LABELS;

  isEditing = signal(false);
  editingUserId: string | null = null;

  userForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(2)], nonNullable: true }),
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    phone: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    enrollment: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    type: new FormControl<'STUDENT' | 'PROFESSOR' | 'STAFF'>('STUDENT', { validators: [Validators.required], nonNullable: true }),
    libraryId: new FormControl('1', { validators: [Validators.required], nonNullable: true }),
  });

  constructor(
    private mockDataService: MockDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.users.set(this.mockDataService.getUsers());
    this.libraries.set(this.mockDataService.getLibraries());
  }

  openUserForm(template: TemplateRef<any>, user?: User): void {
    if (user) {
      this.isEditing.set(true);
      this.editingUserId = user.id;
      this.userForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        enrollment: user.enrollment,
        type: user.type,
        libraryId: user.libraryId,
      });
    } else {
      this.isEditing.set(false);
      this.editingUserId = null;
      this.userForm.reset({
        name: '',
        email: '',
        phone: '',
        enrollment: '',
        type: 'STUDENT',
        libraryId: '1',
      });
    }

    this.dialog.open(template, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });
  }

  submitUserForm(): void {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.getRawValue();
    if (this.isEditing() && this.editingUserId) {
      this.mockDataService.updateUser(this.editingUserId, formValue);
    } else {
      this.mockDataService.addUser({
        ...formValue,
        avatarUrl: null,
        active: true,
      });
    }

    this.loadData();
    this.dialog.closeAll();
  }

  toggleStatus(userId: string): void {
    this.mockDataService.toggleUserStatus(userId);
    this.loadData();
  }
}
