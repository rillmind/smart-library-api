import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { MockDataService } from '../../shared/services/mock-data.service';
import { API_URL, USE_MOCK } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private apiUrl = `${API_URL}/api/user`;

  getUsers(): Observable<User[]> {
    if (USE_MOCK) {
      return of(this.mockData.getUsers());
    }
    return this.http.get<any[]>(`${this.apiUrl}/listar`).pipe(
      map(usuarios => usuarios.map(u => this.mapToFrontend(u)))
    );
  }

  registerUser(user: Omit<User, 'id'> & { password?: string }): Observable<any> {
    if (USE_MOCK) {
      const mockUser: User = {
        ...user,
        id: String(this.mockData.getUsers().length + 1),
      };
      this.mockData.getUsers().push(mockUser);
      return of(mockUser);
    }
    const backendDto = {
      nome: user.name,
      email: user.email,
      cpf: user.enrollment,
      password: user.password || '123456',
    };
    return this.http.post(`${this.apiUrl}/register`, backendDto);
  }

  updateUser(cpf: string, user: Partial<User> & { password?: string }): Observable<any> {
    if (USE_MOCK) {
      const users = this.mockData.getUsers();
      const index = users.findIndex(u => u.enrollment === cpf);
      if (index !== -1) {
        users[index] = { ...users[index], ...user } as User;
      }
      return of(true);
    }
    const backendDto = {
      nome: user.name,
      email: user.email,
      cpf: user.enrollment || cpf,
      password: user.password,
    };
    return this.http.put(`${this.apiUrl}/${cpf}`, backendDto);
  }

  bloqueadorUsuario(cpf: string, bloquear: boolean): Observable<any> {
    if (USE_MOCK) {
      const users = this.mockData.getUsers();
      const index = users.findIndex(u => u.enrollment === cpf);
      if (index !== -1) {
        users[index].active = !bloquear;
      }
      return of(true);
    }
    const action = bloquear ? 'bloquear' : 'desbloquear';
    return this.http.patch(`${this.apiUrl}/${cpf}/${action}`, {});
  }

  private mapToFrontend(u: any): User {
    return {
      id: u.cpf,
      name: u.nome || u.email.split('@')[0],
      email: u.email,
      phone: '(81) 99999-9999',
      enrollment: u.cpf,
      type: 'STUDENT',
      avatarUrl: null,
      libraryId: '1',
      createdAt: new Date(),
      active: !u.bloqueado,
    };
  }
}
