import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../../shared/services/mock-data.service';
import { Book, BOOK_CATEGORY_LABELS } from '../../../../core/models/book.model';
import { BookFormDrawerComponent } from '../../components/book-form-drawer/book-form-drawer.component';
import { AuthService } from '../../../../core/services/auth.service';

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
  private mockData = inject(MockDataService);
  authService = inject(AuthService);

  bookDrawer = viewChild<BookFormDrawerComponent>('bookDrawer');

  allBooks = signal<Book[]>([]);

  filteredBooks = signal<Book[]>([]);

  searchQuery = signal('');

  categoryLabels = BOOK_CATEGORY_LABELS;

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    const books = this.mockData.getBooks();
    this.allBooks.set(books);
    this.filteredBooks.set(books);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredBooks.set(this.allBooks());
      return;
    }
    this.filteredBooks.set(
      this.allBooks().filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q)
      )
    );
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
      const success = this.mockData.deleteBook(bookId);
      if (success) {
        this.loadBooks();
      }
    }
  }
}
