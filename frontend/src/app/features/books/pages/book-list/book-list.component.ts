import { Component, inject, OnInit, signal, viewChild, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../../core/services/book.service';
import { Book, BOOK_CATEGORY_LABELS } from '../../../../core/models/book.model';
import { BookFormDrawerComponent } from '../../components/book-form-drawer/book-form-drawer.component';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanService } from '../../../../core/services/loan.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { SearchService } from '../../../../core/services/search.service';
import { WaitlistService } from '../../../../core/services/waitlist.service';
import { WaitlistEntry } from '../../../../core/models/waitlist.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    BookFormDrawerComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private loanService = inject(LoanService);
  private waitlistService = inject(WaitlistService);
  private snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  searchService = inject(SearchService);

  bookDrawer = viewChild<BookFormDrawerComponent>('bookDrawer');
  allBooks = signal<Book[]>([]);
  myWaitlist = signal<WaitlistEntry[]>([]);
  categoryLabels = BOOK_CATEGORY_LABELS;

  filteredBooks = computed(() => {
    const list = this.allBooks();
    const q = this.searchService.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (b) =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.isbn || '').toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadBooks();
    this.loadMyWaitlist();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.allBooks.set([...books]);
    });
  }

  loadMyWaitlist(): void {
    const user = this.authService.currentUser();
    if (user && !this.authService.isAdmin()) {
      this.waitlistService.getMyWaitlist(user.id).subscribe((entries) => {
        this.myWaitlist.set(entries);
      });
    }
  }

  openDrawer(book?: Book): void {
    this.bookDrawer()?.open(book);
  }

  onBookSaved(): void {
    this.loadBooks();
  }

  editBook(book: Book): void {
    this.openDrawer(book);
  }

  deleteBook(bookId: string): void {
    if (confirm('Tem certeza de que deseja remover este livro do acervo?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.snackBar.open('Livro removido com sucesso!', 'Fechar', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.loadBooks();
        },
        error: (err) => {
          const msg = err?.error?.message || 'Erro ao remover livro. Verifique se ele possui empréstimos ativos.';
          this.snackBar.open(msg, 'Fechar', {
            duration: 6000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  requestLoan(book: Book): void {
    const user = this.authService.currentUser();
    if (user) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const loanData = {
        userId: user.id,
        userName: user.name,
        bookId: String(book.id),
        bookTitle: book.title,
        loanDate: new Date(),
        dueDate: dueDate,
        returnDate: null,
        status: 'ACTIVE' as const,
        libraryId: user.libraryId || '1',
      };

      this.loanService.addLoan(loanData).subscribe(() => {
        this.snackBar.open('Empréstimo solicitado com sucesso!', 'Fechar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.loadBooks();
      });
    }
  }

  getWaitlistEntry(bookId: string): WaitlistEntry | undefined {
    return this.myWaitlist().find(w => w.bookId === bookId && w.status === 'AGUARDANDO');
  }

  joinWaitlist(book: Book): void {
    const user = this.authService.currentUser();
    if (user) {
      this.waitlistService.joinWaitlist(String(book.id), user.id).subscribe({
        next: () => {
          this.snackBar.open('Entrou na fila de espera com sucesso!', 'Fechar', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.loadMyWaitlist();
        },
        error: (err) => {
          const msg = err?.error?.message || 'Erro ao entrar na fila de espera.';
          this.snackBar.open(msg, 'Fechar', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  leaveWaitlist(entry: WaitlistEntry): void {
    this.waitlistService.leaveWaitlist(entry.id).subscribe(() => {
      this.snackBar.open('Saiu da fila de espera com sucesso!', 'Fechar', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      this.loadMyWaitlist();
    });
  }
}
