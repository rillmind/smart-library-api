
export interface Book {
  
  id: string;
  
  title: string;
  
  author: string;
  
  isbn: string;
  
  publisher: string;
  
  year: number;
  
  category: BookCategory;
  
  totalCopies: number;
  
  availableCopies: number;
  
  libraryId: string;
  
  coverUrl: string | null;
  
  description: string;
}

export type BookCategory =
  | 'ENGINEERING'
  | 'SCIENCE'
  | 'LITERATURE'
  | 'HISTORY'
  | 'PHILOSOPHY'
  | 'ARTS'
  | 'TECHNOLOGY'
  | 'MATHEMATICS'
  | 'LAW'
  | 'MEDICINE'
  | 'OTHER';

export const BOOK_CATEGORY_LABELS: Record<BookCategory, string> = {
  ENGINEERING: 'Engenharia',
  SCIENCE: 'Ciências',
  LITERATURE: 'Literatura',
  HISTORY: 'História',
  PHILOSOPHY: 'Filosofia',
  ARTS: 'Artes',
  TECHNOLOGY: 'Tecnologia',
  MATHEMATICS: 'Matemática',
  LAW: 'Direito',
  MEDICINE: 'Medicina',
  OTHER: 'Outros',
};
