import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { AppNotification, NotificationType } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatBadgeModule, MatChipsModule, MatDividerModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent implements OnInit {
  private notificationService = inject(NotificationService);
  authService = inject(AuthService);
  translationService = inject(TranslationService);

  notifications = signal<AppNotification[]>([]);
  loading = signal(true);

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  ngOnInit(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      this.loading.set(false);
      return;
    }

    this.notificationService.getNotifications(userId).subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.notifications.update(list =>
        list.map(n => n.id === id ? { ...n, read: true } : n)
      );
    });
  }

  markAllAsRead(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.notificationService.markAllAsRead(userId).subscribe(() => {
      this.notifications.update(list =>
        list.map(n => ({ ...n, read: true }))
      );
    });
  }

  getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      LIVRO_DISPONIVEL: 'menu_book',
      EMPRESTIMO_VENCENDO: 'schedule',
      EMPRESTIMO_ATRASADO: 'warning',
    };
    return icons[type] || 'notifications';
  }

  getIconClass(type: NotificationType): string {
    const classes: Record<NotificationType, string> = {
      LIVRO_DISPONIVEL: 'icon--success',
      EMPRESTIMO_VENCENDO: 'icon--warning',
      EMPRESTIMO_ATRASADO: 'icon--error',
    };
    return classes[type] || '';
  }
}
