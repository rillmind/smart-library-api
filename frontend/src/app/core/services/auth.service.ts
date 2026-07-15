import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
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

  loginAsAdmin(): void {
    if (USE_MOCK) {
      const adminUser: User = {
        id: 'admin',
        name: 'Administrador Principal',
        email: 'admin@ifpe.edu.br',
        phone: '(81) 98888-1111',
        enrollment: 'ADM001',
        type: 'STAFF',
        avatarUrl: null,
        libraryId: '1',
        createdAt: new Date(),
        active: true,
      };
      this.setSession(adminUser, 'ADMIN');
      this.router.navigate(['/dashboard']);
      return;
    }

    const email = 'admin@ifpe.edu.br';
    const cpf = '11144477735';
    const nome = 'Administrador';
    const password = 'adminpassword';

    this.loginHttp(email, cpf, nome, password).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 400) {
          return this.registerHttp(email, cpf, nome, password).pipe(
            switchMap(() => this.loginHttp(email, cpf, nome, password))
          );
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        const adminUser: User = {
          id: cpf,
          name: nome,
          email: email,
          phone: '(81) 99999-9999',
          enrollment: cpf,
          type: 'STAFF',
          avatarUrl: null,
          libraryId: '1',
          createdAt: new Date(),
          active: true,
        };
        this.setSession(adminUser, 'ADMIN');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loginAsUser(): void {
    if (USE_MOCK) {
      const mockUser: User = {
        id: '1',
        name: 'Gustavo de Lima',
        email: 'gustavo.lima@ifpe.edu.br',
        phone: '(11) 99999-0001',
        enrollment: '2024001',
        type: 'STUDENT',
        avatarUrl: null,
        libraryId: '1',
        createdAt: new Date('2024-01-15'),
        active: true,
      };
      this.setSession(mockUser, 'USER');
      this.router.navigate(['/books']);
      return;
    }

    const email = 'membro@ifpe.edu.br';
    const cpf = '22255588846';
    const nome = 'Gustavo de Lima';
    const password = 'userpassword';

    this.loginHttp(email, cpf, nome, password).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 400) {
          return this.registerHttp(email, cpf, nome, password).pipe(
            switchMap(() => this.loginHttp(email, cpf, nome, password))
          );
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        const mockUser: User = {
          id: cpf,
          name: nome,
          email: email,
          phone: '(81) 99999-9999',
          enrollment: cpf,
          type: 'STUDENT',
          avatarUrl: null,
          libraryId: '1',
          createdAt: new Date(),
          active: true,
        };
        this.setSession(mockUser, 'USER');
        this.router.navigate(['/books']);
      }
    });
  }

  private loginHttp(email: string, cpf: string, nome: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, cpf, nome, password }, { responseType: 'text' });
  }

  private registerHttp(email: string, cpf: string, nome: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, cpf, nome, password }, { responseType: 'text' });
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
