import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MockDataService } from '../../../../shared/services/mock-data.service';
import { User, USER_TYPE_LABELS } from '../../../../core/models/user.model';
import { Loan, LOAN_STATUS_LABELS } from '../../../../core/models/loan.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, MatChipsModule, MatTableModule, DatePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  private mockData = inject(MockDataService);
  private authService = inject(AuthService);

  user = signal<User | null>(null);

  userLoans = signal<Loan[]>([]);

  userStats = signal({ totalLoans: 0, activeLoans: 0, overdueLoans: 0, returnedLoans: 0 });

  typeLabels = USER_TYPE_LABELS;

  statusLabels: Record<string, string> = LOAN_STATUS_LABELS;

  displayedColumns = ['bookTitle', 'loanDate', 'dueDate', 'returnDate', 'status'];

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.userLoans.set(this.mockData.getLoansByUserId(currentUser.id));
      this.userStats.set(this.mockData.getUserStats(currentUser.id));
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
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
