import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService, AuditLog } from '../../../../core/services/audit.service';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './audit-list.component.html',
  styleUrl: './audit-list.component.scss',
})
export class AuditListComponent implements OnInit {
  private auditService = inject(AuditService);
  translationService = inject(TranslationService);

  logs = signal<AuditLog[]>([]);
  searchQuery = signal<string>('');

  filteredLogs = computed(() => {
    let list = this.logs();
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      list = list.filter(
        (l) =>
          l.acao.toLowerCase().includes(query) ||
          l.autor.toLowerCase().includes(query)
      );
    }

    return list;
  });

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.auditService.getLogs().subscribe((logs) => this.logs.set(logs));
  }

  getLogIcon(acao: string): string {
    const actionLower = acao.toLowerCase();
    if (actionLower.includes('livro')) return 'menu_book';
    if (actionLower.includes('membro') || actionLower.includes('usuário') || actionLower.includes('perfil')) return 'person';
    if (actionLower.includes('empréstimo') || actionLower.includes('devolvido') || actionLower.includes('renovado')) return 'swap_horiz';
    return 'info';
  }

  getOperatorClass(autor: string): string {
    if (autor && autor.toLowerCase() === 'sistema') return 'operator-badge--system';
    return 'operator-badge--admin';
  }
}
