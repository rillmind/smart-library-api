import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { MockDataService } from '../../shared/services/mock-data.service';
import { API_URL, USE_MOCK } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private apiUrl = `${API_URL}/livro`;

  getBooks(): Observable<Book[]> {
    if (USE_MOCK) {
      return of(this.mockData.getBooks());
    }
    return this.http.get<any[]>(`${this.apiUrl}?t=${Date.now()}`).pipe(
      map(livros => livros.map(l => this.mapToFrontend(l)))
    );
  }

  getBookById(id: string): Observable<Book> {
    if (USE_MOCK) {
      const book = this.mockData.getBookById(id);
      return book ? of(book) : of({} as Book);
    }
    return this.http.get<any>(`${this.apiUrl}/${id}?t=${Date.now()}`).pipe(
      map(l => this.mapToFrontend(l))
    );
  }

  addBook(book: Omit<Book, 'id'>): Observable<any> {
    if (USE_MOCK) {
      return of(this.mockData.addBook(book));
    }
    const backendBook = this.mapToBackend(book);
    return this.http.post(this.apiUrl, backendBook);
  }

  updateBook(id: string, book: Partial<Book>): Observable<any> {
    if (USE_MOCK) {
      const books = this.mockData.getBooks();
      const index = books.findIndex(b => b.id === id);
      if (index !== -1) {
        books[index] = { ...books[index], ...book };
      }
      return of(true);
    }
    const backendBook = {
      titulo: book.title,
      autor: book.author,
      descricao: book.description || '',
    };
    return this.http.put(`${this.apiUrl}/${id}`, backendBook);
  }

  deleteBook(id: string): Observable<any> {
    if (USE_MOCK) {
      const books = this.mockData.getBooks();
      const index = books.findIndex(b => b.id === id);
      if (index !== -1) {
        books.splice(index, 1);
      }
      return of(true);
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private mapToFrontend(l: any): Book {
    return {
      id: String(l.id),
      title: l.titulo || 'Sem Título',
      author: l.autor || 'Autor Desconhecido',
      isbn: l.isbn || 'N/A',
      publisher: l.editora || 'Editora Geral',
      year: l.ano || 2026,
      category: l.categoria || 'TECHNOLOGY',
      totalCopies: l.totalCopies || 1,
      availableCopies: l.posse ? 0 : 1,
      libraryId: l.libraryId || '1',
      coverUrl: l.coverUrl || null,
      description: l.descricao || '',
    };
  }

  private mapToBackend(b: any): any {
    return {
      titulo: b.title,
      autor: b.author,
      descricao: b.description || '',
    };
  }
}
