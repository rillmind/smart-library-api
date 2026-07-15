import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MockDataService } from '../../../../shared/services/mock-data.service';
import { BookService } from '../../../../core/services/book.service';
import { UserService } from '../../../../core/services/user.service';
import { LoanService } from '../../../../core/services/loan.service';
import { Loan, LOAN_STATUS_LABELS } from '../../../../core/models/loan.model';
import { Book, BOOK_CATEGORY_LABELS } from '../../../../core/models/book.model';
import { AuthService } from '../../../../core/services/auth.service';
import { USE_MOCK } from '../../../../core/config/api.config';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTableModule, MatChipsModule, DatePipe],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent implements OnInit {
  private mockData = inject(MockDataService);
  private bookService = inject(BookService);
  private userService = inject(UserService);
  private loanService = inject(LoanService);
  authService = inject(AuthService);
  translationService = inject(TranslationService);

  isAdmin = signal(false);

  stats = signal({ totalBooks: 0, totalUsers: 0, activeLoans: 0, overdueLoans: 0 });
  userStats = signal({ returnedLoans: 0, activeLoans: 0, overdueLoans: 0, nextDue: 'Nenhum' });
  recentLoans = signal<Loan[]>([]);
  statusLabels: Record<string, string> = LOAN_STATUS_LABELS;
  categoryLabels = BOOK_CATEGORY_LABELS;

  displayedColumns = computed(() => {
    if (this.authService.isAdmin()) {
      return ['bookTitle', 'userName', 'loanDate', 'dueDate', 'status'];
    }
    return ['bookTitle', 'loanDate', 'dueDate', 'status'];
  });

  statCards = computed(() => {
    const s = this.stats();
    const u = this.userStats();
    const t = this.translationService.translate.bind(this.translationService);
    
    if (this.authService.isAdmin()) {
      return [
        { icon: 'menu_book', label: t('total_books'), value: s.totalBooks, color: '#1565C0', bgColor: '#E3F2FD' },
        { icon: 'people', label: t('registered_users'), value: s.totalUsers, color: '#7B1FA2', bgColor: '#F3E5F5' },
        { icon: 'swap_horiz', label: t('active_loans'), value: s.activeLoans, color: '#2E7D32', bgColor: '#E8F5E9' },
        { icon: 'warning', label: t('overdue_loans'), value: s.overdueLoans, color: '#C62828', bgColor: '#FFEBEE' },
      ];
    } else {
      return [
        { icon: 'check_circle', label: t('books_read'), value: u.returnedLoans, color: '#2E7D32', bgColor: '#E8F5E9' },
        { icon: 'swap_horiz', label: t('active_loans'), value: u.activeLoans, color: '#1565C0', bgColor: '#E3F2FD' },
        { icon: 'warning', label: t('overdue_loans'), value: u.overdueLoans, color: '#C62828', bgColor: '#FFEBEE' },
        { icon: 'event', label: t('next_due'), value: u.nextDue, color: '#FF8F00', bgColor: '#FFF8E1' },
      ];
    }
  });

  logs = signal<{ action: string; timestamp: Date }[]>([]);
  categoryData = signal<{ label: string; count: number; percentage: number; color: string }[]>([]);
  recommendedBooks = signal<Book[]>([]);

  ngOnInit(): void {
    const isAdm = this.authService.isAdmin();
    this.isAdmin.set(isAdm);

    if (isAdm) {
      this.loadAdminDashboard();
    } else {
      this.loadUserDashboard();
    }
  }

  private loadAdminDashboard(): void {
    if (USE_MOCK) {
      const s = this.mockData.getStats();
      this.stats.set(s);
      this.recentLoans.set(this.mockData.getLoans().slice(0, 5));
      this.logs.set(this.mockData.getLogs().slice(0, 6));
      this.calculateCategories(this.mockData.getBooks());
      return;
    }

    forkJoin({
      books: this.bookService.getBooks(),
      users: this.userService.getUsers(),
      loans: this.loanService.getLoans(),
    }).subscribe(({ books, users, loans }) => {
      const activeLoansCount = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE').length;
      const overdueLoansCount = loans.filter((l) => l.status === 'OVERDUE').length;

      this.stats.set({
        totalBooks: books.length,
        totalUsers: users.length,
        activeLoans: activeLoansCount,
        overdueLoans: overdueLoansCount,
      });

      this.recentLoans.set(loans.slice(0, 5));

      this.logs.set(this.mockData.getLogs().slice(0, 6));
      this.calculateCategories(books);
    });
  }

  private loadUserDashboard(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    if (USE_MOCK) {
      const uStats = this.mockData.getUserStats(user.id);
      const loans = this.mockData.getLoansByUserId(user.id);
      this.recentLoans.set(loans.slice(0, 5));
      this.userStats.set({
        returnedLoans: uStats.returnedLoans,
        activeLoans: uStats.activeLoans,
        overdueLoans: uStats.overdueLoans,
        nextDue: this.getNextDueDate(loans),
      });
      const userLogs = this.mockData.getLogs().filter((log) =>
        log.action.includes(user.name) || log.action.includes('Membro')
      );
      this.logs.set(userLogs.slice(0, 6));
      this.recommendedBooks.set(this.mockData.getBooks().filter((b) => b.availableCopies > 0).slice(0, 3));
      return;
    }

    forkJoin({
      books: this.bookService.getBooks(),
      userLoans: this.loanService.getLoansByUserId(user.id),
    }).subscribe(({ books, userLoans }) => {
      this.recentLoans.set(userLoans.slice(0, 5));

      const returnedLoans = userLoans.filter((l) => l.status === 'RETURNED').length;
      const activeLoans = userLoans.filter((l) => l.status === 'ACTIVE').length;
      const overdueLoans = userLoans.filter((l) => l.status === 'OVERDUE').length;

      this.userStats.set({
        returnedLoans: returnedLoans,
        activeLoans: activeLoans,
        overdueLoans: overdueLoans,
        nextDue: this.getNextDueDate(userLoans),
      });

      const userLogs = this.mockData.getLogs().filter((log) =>
        log.action.includes(user.name) || log.action.includes('Membro')
      );
      this.logs.set(userLogs.slice(0, 6));

      const recommended = books.filter((b) => b.availableCopies > 0).slice(0, 3);
      this.recommendedBooks.set(recommended);
    });
  }

  private calculateCategories(books: Book[]): void {
    const categoriesCount: Record<string, number> = {};
    books.forEach((b) => {
      categoriesCount[b.category] = (categoriesCount[b.category] || 0) + 1;
    });

    const colors = ['#1565C0', '#2E7D32', '#FF8F00', '#C62828', '#7B1FA2', '#00838F'];
    let colorIdx = 0;
    const catData = Object.entries(categoriesCount).map(([cat, count]) => {
      const percentage = books.length > 0 ? Math.round((count / books.length) * 100) : 0;
      return {
        label: cat,
        count,
        percentage,
        color: colors[colorIdx++ % colors.length],
      };
    }).sort((a, b) => b.count - a.count).slice(0, 4);

    this.categoryData.set(catData);
  }

  private getNextDueDate(loans: Loan[]): string {
    const activeLoans = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE');
    if (activeLoans.length === 0) return 'Nenhum';

    const sorted = [...activeLoans].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const nextDate = new Date(sorted[0].dueDate);
    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'status-badge--active',
      RETURNED: 'status-badge--returned',
      OVERDUE: 'status-badge--overdue',
      RESERVED: 'status-badge--reserved',
    };
    return map[status] || '';
  }
}
