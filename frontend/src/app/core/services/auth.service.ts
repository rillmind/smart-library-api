import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { API_URL, USE_MOCK } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/api/user`;

  currentUser = signal<User | null>(null);
  userRole = signal<'ADMIN' | 'USER' | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('sl_user');
    const savedRole = localStorage.getItem('sl_role');

    if (savedUser && savedRole) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
        this.userRole.set(savedRole as 'ADMIN' | 'USER');
      } catch (e) {
        this.clearSession();
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    if (USE_MOCK) {
      const is_admin = email.includes('admin');
      const mockUser: User = {
        id: is_admin ? 'admin' : '1',
        name: is_admin ? 'Administrador Principal' : 'Gustavo de Lima',
        email: email,
        phone: '(81) 99999-9999',
        enrollment: is_admin ? 'ADM001' : '2024001',
        type: is_admin ? 'STAFF' : 'STUDENT',
        avatarUrl: null,
        libraryId: '1',
        createdAt: new Date(),
        active: true,
      };
      this.setSession(mockUser, is_admin ? 'ADMIN' : 'USER');
      return of(mockUser);
    }

    return this.http.post(`${this.apiUrl}/login`, { 
      email, 
      password,
      nome: 'Autenticacao',
      cpf: '00000000000'
    }, { responseType: 'text' }).pipe(
      switchMap(() => {
        return this.http.get<any[]>(`${this.apiUrl}/listar`).pipe(
          map(users => {
            const found = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (!found) throw new Error("Usuário não encontrado nos registros do sistema.");
            
            const is_admin = email.includes('admin') || email.includes('raul') || found.nome.toLowerCase().includes('admin');
            const user: User = {
              id: found.cpf,
              name: found.nome,
              email: found.email,
              phone: '(81) 99999-9999',
              enrollment: found.cpf,
              type: is_admin ? 'STAFF' : 'STUDENT',
              avatarUrl: null,
              libraryId: '1',
              createdAt: new Date(),
              active: !found.bloqueado,
            };
            
            this.setSession(user, is_admin ? 'ADMIN' : 'USER');
            return user;
          })
        );
      })
    );
  }

  register(nome: string, email: string, cpf: string, password: string): Observable<any> {
    if (USE_MOCK) {
      return of(true);
    }
    return this.http.post(`${this.apiUrl}/register`, { nome, email, cpf, password }, { responseType: 'text' });
  }

  logout(): void {
    if (USE_MOCK) {
      this.clearSession();
      this.router.navigate(['/auth/login']);
      return;
    }

    this.http.post(`${this.apiUrl}/logout`, {}, { responseType: 'text' }).subscribe({
      next: () => {
        this.clearSession();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.clearSession();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.userRole() === 'ADMIN';
  }

  private setSession(user: User, role: 'ADMIN' | 'USER'): void {
    this.currentUser.set(user);
    this.userRole.set(role);
    localStorage.setItem('sl_user', JSON.stringify(user));
    localStorage.setItem('sl_role', role);
  }

  private clearSession(): void {
    this.currentUser.set(null);
    this.userRole.set(null);
    localStorage.removeItem('sl_user');
    localStorage.removeItem('sl_role');
  }
}
