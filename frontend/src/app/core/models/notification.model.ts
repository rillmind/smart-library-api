export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 'LIVRO_DISPONIVEL' | 'EMPRESTIMO_VENCENDO' | 'EMPRESTIMO_ATRASADO';

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  LIVRO_DISPONIVEL: 'Livro Disponível',
  EMPRESTIMO_VENCENDO: 'Empréstimo Vencendo',
  EMPRESTIMO_ATRASADO: 'Empréstimo Atrasado',
};
