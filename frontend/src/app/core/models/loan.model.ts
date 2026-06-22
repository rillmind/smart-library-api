
export interface Loan {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  loanDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: LoanStatus;
  libraryId: string;
  acceptedBy: string;
}

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'RESERVED';

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  ACTIVE: 'Ativo',
  RETURNED: 'Devolvido',
  OVERDUE: 'Atrasado',
  RESERVED: 'Reservado',
};
