import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { WaitlistEntry } from '../models/waitlist.model';
import { MockDataService } from '../../shared/services/mock-data.service';
import { API_URL, USE_MOCK } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class WaitlistService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private apiUrl = `${API_URL}/fila-espera`;

  joinWaitlist(bookId: string, userId: string): Observable<any> {
    if (USE_MOCK) {
      return of(this.mockData.joinWaitlist(bookId, userId));
    }
    return this.http.post(`${this.apiUrl}?cpf=${userId}&livroId=${bookId}`, {});
  }

  leaveWaitlist(id: string): Observable<any> {
    if (USE_MOCK) {
      this.mockData.leaveWaitlist(id);
      return of(true);
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getWaitlistByBook(bookId: string): Observable<WaitlistEntry[]> {
    if (USE_MOCK) {
      return of(this.mockData.getWaitlistByBook(bookId));
    }
    return this.http.get<any[]>(`${this.apiUrl}/livro/${bookId}`).pipe(
      map(items => items.map(i => this.mapToFrontend(i)))
    );
  }

  getMyWaitlist(userId: string): Observable<WaitlistEntry[]> {
    if (USE_MOCK) {
      return of(this.mockData.getWaitlistByUser(userId));
    }
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${userId}`).pipe(
      map(items => items.map(i => this.mapToFrontend(i)))
    );
  }

  private mapToFrontend(item: any): WaitlistEntry {
    return {
      id: String(item.id),
      userId: item.idUsuario?.cpf || '',
      userName: item.idUsuario?.nome || '',
      bookId: String(item.idLivro?.id || ''),
      bookTitle: item.idLivro?.titulo || '',
      position: item.posicao || 0,
      entryDate: item.dataEntrada ? new Date(item.dataEntrada) : new Date(),
      status: item.status || 'AGUARDANDO',
    };
  }
}
