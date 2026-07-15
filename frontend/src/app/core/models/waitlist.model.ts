export interface WaitlistEntry {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  position: number;
  entryDate: Date;
  status: WaitlistStatus;
}

export type WaitlistStatus = 'AGUARDANDO' | 'NOTIFICADO' | 'CANCELADO';

export const WAITLIST_STATUS_LABELS: Record<WaitlistStatus, string> = {
  AGUARDANDO: 'Aguardando',
  NOTIFICADO: 'Notificado',
  CANCELADO: 'Cancelado',
};
