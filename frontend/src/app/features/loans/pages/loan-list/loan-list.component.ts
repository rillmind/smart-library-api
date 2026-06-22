import { Component, OnInit, signal, computed, TemplateRef, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MockDataService } from '../../../../shared/services/mock-data.service';
import { Loan, LOAN_STATUS_LABELS, LoanStatus } from '../../../../core/models/loan.model';
import { Book } from '../../../../core/models/book.model';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss',
})
export class LoanListComponent implements OnInit {
  authService = inject(AuthService);

  loans = signal<Loan[]>([]);
  searchQuery = signal<string>('');
  statusFilter = signal<string>('ALL');
  selectedLoan = signal<Loan | null>(null);
  users = signal<User[]>([]);
  books = signal<Book[]>([]);

  statusLabels: Record<string, string> = LOAN_STATUS_LABELS;

  displayedColumns = computed(() => {
    if (this.authService.isAdmin()) {
      return ['bookTitle', 'userName', 'loanDate', 'dueDate', 'returnDate', 'status'];
    }
    return ['bookTitle', 'loanDate', 'dueDate', 'returnDate', 'status'];
  });

  newLoanForm = new FormGroup({
    userId: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    bookId: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    dueDate: new FormControl(this.getDefaultDueDate(), { validators: [Validators.required], nonNullable: true }),
  });

  filteredLoans = computed(() => {
    let list = this.loans();
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.statusFilter();

    if (query) {
      list = list.filter(
         (l) =>
          l.bookTitle.toLowerCase().includes(query) ||
          l.userName.toLowerCase().includes(query)
      );
    }

    if (filter !== 'ALL') {
      list = list.filter((l) => l.status === filter);
    }

    return list;
  });

  constructor(
    private mockDataService: MockDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const user = this.authService.currentUser();
    if (this.authService.isAdmin()) {
      this.loans.set(this.mockDataService.getLoans());
      this.users.set(this.mockDataService.getUsers().filter((u) => u.active));
      this.books.set(this.mockDataService.getBooks().filter((b) => b.availableCopies > 0));
    } else if (user) {
      this.loans.set(this.mockDataService.getLoansByUserId(user.id));
      this.users.set([]);
      this.books.set([]);
    }
  }

  getStatusClass(status: LoanStatus): string {
    const classes: Record<LoanStatus, string> = {
      ACTIVE: 'status-badge--active',
      RETURNED: 'status-badge--returned',
      OVERDUE: 'status-badge--overdue',
      RESERVED: 'status-badge--reserved',
    };
    return classes[status] || '';
  }

  getDefaultDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().substring(0, 10);
  }

  openLoanDetails(loan: Loan, template: TemplateRef<any>): void {
    this.selectedLoan.set(loan);
    this.dialog.open(template, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });
  }

  openNewLoan(template: TemplateRef<any>): void {
    this.newLoanForm.reset({
      userId: '',
      bookId: '',
      dueDate: this.getDefaultDueDate(),
    });
    this.dialog.open(template, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });
  }

  submitNewLoan(): void {
    if (this.newLoanForm.invalid) return;

    const { userId, bookId, dueDate } = this.newLoanForm.getRawValue();
    const user = this.users().find((u) => u.id === userId);
    const book = this.books().find((b) => b.id === bookId);

    if (user && book) {
      this.mockDataService.addLoan({
        userId,
        userName: user.name,
        bookId,
        bookTitle: book.title,
        loanDate: new Date(),
        dueDate: new Date(dueDate),
        returnDate: null,
        status: 'ACTIVE',
        libraryId: user.libraryId,
        acceptedBy: 'Gustavo de Lima',
      });

      this.loadData();
      this.dialog.closeAll();
    }
  }

  renew(id: string): void {
    const updated = this.mockDataService.renewLoan(id);
    if (updated) {
      this.loadData();
      this.selectedLoan.set(updated);
      this.dialog.closeAll();
    }
  }

  returnLoan(id: string): void {
    const updated = this.mockDataService.returnLoan(id);
    if (updated) {
      this.loadData();
      this.selectedLoan.set(updated);
      this.dialog.closeAll();
    }
  }
}
