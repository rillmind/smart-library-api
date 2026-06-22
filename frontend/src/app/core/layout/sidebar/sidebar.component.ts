import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

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

  navItems = computed<NavItem[]>(() => {
    if (this.authService.isAdmin()) {
      return [
        { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', exact: true },
        { icon: 'menu_book', label: 'Livros', route: '/books' },
        { icon: 'swap_horiz', label: 'Empréstimos', route: '/loans' },
        { icon: 'people', label: 'Usuários', route: '/users', exact: true },
      ];
    } else {
      return [
        { icon: 'menu_book', label: 'Livros', route: '/books' },
        { icon: 'swap_horiz', label: 'Meus Empréstimos', route: '/loans' },
      ];
    }
  });

  secondaryNavItems = computed<NavItem[]>(() => {
    return [
      { icon: 'person', label: 'Meu Perfil', route: '/users/profile', exact: true },
      { icon: 'settings', label: 'Configurações', route: '/settings', exact: true },
    ];
  });
}
