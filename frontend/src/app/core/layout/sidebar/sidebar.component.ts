import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { SidebarService } from '../../../core/services/sidebar.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  sidebarService = inject(SidebarService);

  navItems = computed<NavItem[]>(() => {
    if (this.authService.isAdmin()) {
      return [
        { icon: 'dashboard', label: this.translationService.translate('dashboard'), route: '/dashboard', exact: true },
        { icon: 'menu_book', label: this.translationService.translate('books'), route: '/books' },
        { icon: 'swap_horiz', label: this.translationService.translate('loans'), route: '/loans' },
        { icon: 'people', label: this.translationService.translate('users'), route: '/users', exact: true },
        { icon: 'history', label: this.translationService.translate('audit'), route: '/audit' },
      ];
    } else {
      return [
        { icon: 'menu_book', label: this.translationService.translate('books'), route: '/books' },
        { icon: 'swap_horiz', label: this.translationService.translate('loans'), route: '/loans' },
      ];
    }
  });

  secondaryNavItems = computed<NavItem[]>(() => {
    return [
      { icon: 'person', label: this.translationService.translate('profile'), route: '/users/profile', exact: true },
      { icon: 'settings', label: this.translationService.translate('settings'), route: '/settings', exact: true },
    ];
  });
}
