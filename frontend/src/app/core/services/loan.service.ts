import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Loan, LoanStatus } from '../models/loan.model';
import { MockDataService } from '../../shared/services/mock-data.service';
import { API_URL, USE_MOCK } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private apiUrl = `${API_URL}/emprestimo`;

  getLoans(): Observable<Loan[]> {
    if (USE_MOCK) {
      return of(this.mockData.getLoans());
    }
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(loans => loans.map(l => this.mapToFrontend(l)))
    );
  }

  getLoansByUserId(userId: string): Observable<Loan[]> {
    if (USE_MOCK) {
      return of(this.mockData.getLoansByUserId(userId));
    }
    return this.getLoans().pipe(
      map(loans => loans.filter(l => l.userId === userId))
    );
  }

  addLoan(loan: Omit<Loan, 'id'>): Observable<any> {
    if (USE_MOCK) {
      const mockLoans = this.mockData.getLoans();
      const newLoan: Loan = {
        ...loan,
        id: String(mockLoans.length + 1),
      };
      mockLoans.push(newLoan);
      return of(newLoan);
    }
    const backendDto = {
      id_usuario: { cpf: loan.userId },
      id_livro: { id: Number(loan.bookId) },
      data_emprestimo: this.formatDate(loan.loanDate),
      data_devolucao: this.formatDate(loan.dueDate),
      status: 'ACTIVE',
    };
    return this.http.post(this.apiUrl, backendDto);
  }

  updateLoan(id: string, loan: Partial<Loan>): Observable<any> {
    if (USE_MOCK) {
      const mockLoans = this.mockData.getLoans();
      const index = mockLoans.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLoans[index] = { ...mockLoans[index], ...loan } as Loan;
      }
      return of(true);
    }
    const backendDto = {
      id: Number(id),
      id_usuario: loan.userId ? { cpf: loan.userId } : null,
      id_livro: loan.bookId ? { id: Number(loan.bookId) } : null,
      data_emprestimo: loan.loanDate ? this.formatDate(loan.loanDate) : null,
      data_devolucao: loan.dueDate ? this.formatDate(loan.dueDate) : null,
      status: loan.status,
    };
    return this.http.put(`${this.apiUrl}/${id}`, backendDto);
  }

  deleteLoan(id: string): Observable<any> {
    if (USE_MOCK) {
      const mockLoans = this.mockData.getLoans();
      const index = mockLoans.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLoans.splice(index, 1);
      }
      return of(true);
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  devolverEmprestimo(id: string): Observable<any> {
    if (USE_MOCK) {
      const mockLoans = this.mockData.getLoans();
      const index = mockLoans.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLoans[index].status = 'RETURNED';
        mockLoans[index].returnDate = new Date();
      }
      return of(true);
    }
    return this.http.patch(`${this.apiUrl}/${id}/devolver`, {});
  }

  renovarEmprestimo(id: string): Observable<any> {
    if (USE_MOCK) {
      const mockLoans = this.mockData.getLoans();
      const index = mockLoans.findIndex(l => l.id === id);
      if (index !== -1) {
        const currentDueDate = new Date(mockLoans[index].dueDate);
        currentDueDate.setDate(currentDueDate.getDate() + 14);
        mockLoans[index].dueDate = currentDueDate;
      }
      return of(true);
    }
    return this.http.patch(`${this.apiUrl}/${id}/renovar`, {});
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  private mapToFrontend(l: any): Loan {
    return {
      id: String(l.id),
      userId: l.id_usuario?.cpf || '',
      userName: l.id_usuario?.nome || l.id_usuario?.email || 'Membro',
      bookId: l.id_livro ? String(l.id_livro.id) : '',
      bookTitle: l.id_livro?.titulo || 'Livro Removido',
      loanDate: l.data_emprestimo ? new Date(l.data_emprestimo) : new Date(),
      dueDate: l.data_devolucao ? new Date(l.data_devolucao) : new Date(),
      returnDate: l.status === 'RETURNED' && l.data_devolucao ? new Date(l.data_devolucao) : null,
      status: l.status as LoanStatus,
      libraryId: '1',
    };
  }
}
