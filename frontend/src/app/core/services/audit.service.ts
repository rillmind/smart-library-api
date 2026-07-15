import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_URL, USE_MOCK } from '../config/api.config';

export interface AuditLog {
  id: number;
  acao: string;
  autor: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/api/logs`;

  getLogs(): Observable<AuditLog[]> {
    if (USE_MOCK) {
      return of([
        { id: 1, acao: 'Membro cadastrado: Maria Oliveira (CPF: 22255588846)', autor: 'Sistema', timestamp: '2026-07-14T19:15:22' },
        { id: 2, acao: 'Livro catalogado: Clean Code (Autor: Robert C. Martin)', autor: 'Administrador', timestamp: '2026-07-14T19:10:05' },
        { id: 3, acao: 'Membro bloqueado: CPF 22255588846', autor: 'Administrador', timestamp: '2026-07-14T19:05:40' },
      ]);
    }
    return this.http.get<AuditLog[]>(this.apiUrl);
  }
}
