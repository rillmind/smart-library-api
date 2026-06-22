import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

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

    this.currentUser.set(adminUser);
    this.userRole.set('ADMIN');

    localStorage.setItem('sl_user', JSON.stringify(adminUser));
    localStorage.setItem('sl_role', 'ADMIN');

    this.router.navigate(['/dashboard']);
  }

  loginAsUser(): void {
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

    this.currentUser.set(mockUser);
    this.userRole.set('USER');

    localStorage.setItem('sl_user', JSON.stringify(mockUser));
    localStorage.setItem('sl_role', 'USER');

    this.router.navigate(['/books']);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.userRole() === 'ADMIN';
  }

  private clearSession(): void {
    this.currentUser.set(null);
    this.userRole.set(null);
    localStorage.removeItem('sl_user');
    localStorage.removeItem('sl_role');
  }
}
