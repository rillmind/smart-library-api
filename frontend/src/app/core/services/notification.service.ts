import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppNotification } from '../models/notification.model';
import { MockDataService } from '../../shared/services/mock-data.service';
import { API_URL, USE_MOCK } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private apiUrl = `${API_URL}/notificacao`;

  unreadCount = signal(0);

  getNotifications(userId: string): Observable<AppNotification[]> {
    if (USE_MOCK) {
      const notifs = this.mockData.getNotifications(userId);
      this.unreadCount.set(notifs.filter(n => !n.read).length);
      return of(notifs);
    }
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${userId}`).pipe(
      map(items => items.map(i => this.mapToFrontend(i))),
      tap(notifs => this.unreadCount.set(notifs.filter(n => !n.read).length))
    );
  }

  getUnreadCount(userId: string): Observable<number> {
    if (USE_MOCK) {
      const count = this.mockData.getNotifications(userId).filter(n => !n.read).length;
      this.unreadCount.set(count);
      return of(count);
    }
    return this.http.get<number>(`${this.apiUrl}/usuario/${userId}/nao-lidas`).pipe(
      tap(count => this.unreadCount.set(count))
    );
  }

  markAsRead(id: string): Observable<any> {
    if (USE_MOCK) {
      this.mockData.markNotificationAsRead(id);
      this.unreadCount.update(c => Math.max(0, c - 1));
      return of(true);
    }
    return this.http.patch(`${this.apiUrl}/${id}/ler`, {}).pipe(
      tap(() => this.unreadCount.update(c => Math.max(0, c - 1)))
    );
  }

  markAllAsRead(userId: string): Observable<any> {
    if (USE_MOCK) {
      this.mockData.markAllNotificationsAsRead(userId);
      this.unreadCount.set(0);
      return of(true);
    }
    return this.http.patch(`${this.apiUrl}/usuario/${userId}/ler-todas`, {}).pipe(
      tap(() => this.unreadCount.set(0))
    );
  }

  private mapToFrontend(item: any): AppNotification {
    return {
      id: String(item.id),
      userId: item.id_usuario?.cpf || '',
      title: item.titulo || '',
      message: item.mensagem || '',
      type: item.tipo || 'LIVRO_DISPONIVEL',
      read: item.lida || false,
      createdAt: new Date(item.data_criacao),
    };
  }
}
