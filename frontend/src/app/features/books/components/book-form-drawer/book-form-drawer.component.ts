import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BOOK_CATEGORY_LABELS, BookCategory, Book } from '../../../../core/models/book.model';
import { MockDataService } from '../../../../shared/services/mock-data.service';

@Component({
  selector: 'app-book-form-drawer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './book-form-drawer.component.html',
  styleUrl: './book-form-drawer.component.scss',
})
export class BookFormDrawerComponent {
  private fb = inject(FormBuilder);
  private mockData = inject(MockDataService);

  closed = output<void>();
  bookSaved = output<void>();
  isOpen = signal(false);
  isEditing = signal(false);
  editingBookId: string | null = null;
  categoryLabels = BOOK_CATEGORY_LABELS;
  categories = signal<BookCategory[]>(Object.keys(BOOK_CATEGORY_LABELS) as BookCategory[]);
  libraries = signal(this.mockData.getLibraries());

  bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    author: ['', [Validators.required, Validators.minLength(2)]],
    isbn: ['', [Validators.required]],
    publisher: ['', [Validators.required]],
    year: [2026, [Validators.required, Validators.min(1000), Validators.max(2035)]],
    category: ['TECHNOLOGY' as BookCategory, [Validators.required]],
    totalCopies: [1, [Validators.required, Validators.min(1)]],
    libraryId: ['1', [Validators.required]],
    description: [''],
  });

  open(book?: Book): void {
    this.isOpen.set(true);
    if (book) {
      this.isEditing.set(true);
      this.editingBookId = book.id;
      this.bookForm.reset({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher,
        year: book.year,
        category: book.category,
        totalCopies: book.totalCopies,
        libraryId: book.libraryId,
        description: book.description,
      });
    } else {
      this.isEditing.set(false);
      this.editingBookId = null;
      this.bookForm.reset({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        year: 2026,
        category: 'TECHNOLOGY',
        totalCopies: 1,
        libraryId: '1',
        description: '',
      });
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  onSave(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.getRawValue();
      const bookData = {
        title: formValue.title!,
        author: formValue.author!,
        isbn: formValue.isbn!,
        publisher: formValue.publisher!,
        year: formValue.year!,
        category: formValue.category!,
        totalCopies: formValue.totalCopies!,
        availableCopies: formValue.totalCopies!,
        libraryId: formValue.libraryId!,
        coverUrl: null,
        description: formValue.description || '',
      };

      if (this.isEditing() && this.editingBookId) {
        this.mockData.updateBook(this.editingBookId, bookData);
      } else {
        this.mockData.addBook(bookData);
      }

      this.bookSaved.emit();
      this.close();
    } else {
      this.bookForm.markAllAsTouched();
    }
  }
}
