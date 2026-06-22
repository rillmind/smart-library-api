
export interface User {
  
  id: string;
  
  name: string;
  
  email: string;
  
  phone: string;
  
  enrollment: string;
  
  type: UserType;
  
  avatarUrl: string | null;
  
  libraryId: string;
  
  createdAt: Date;
  
  active: boolean;
}

export type UserType = 'STUDENT' | 'PROFESSOR' | 'STAFF';

export const USER_TYPE_LABELS: Record<UserType, string> = {
  STUDENT: 'Aluno',
  PROFESSOR: 'Professor',
  STAFF: 'Funcionário',
};
