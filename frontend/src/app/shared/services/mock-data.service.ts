import { Injectable } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Book } from '../../core/models/book.model';
import { Loan } from '../../core/models/loan.model';
import { Library } from '../../core/models/library.model';
import { WaitlistEntry } from '../../core/models/waitlist.model';
import { AppNotification } from '../../core/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private logs: { action: string; timestamp: Date }[] = [
    { action: 'Sistema iniciado com sucesso.', timestamp: new Date(Date.now() - 7200000) },
    { action: 'Livro "Clean Code" retirado pelo usuário Gustavo de Lima.', timestamp: new Date(Date.now() - 3600000) },
    { action: 'Empréstimo #1 devolvido pelo usuário Gustavo de Lima.', timestamp: new Date(Date.now() - 1800000) }
  ];

  private libraries: Library[] = [
    { id: '1', name: 'Biblioteca Central', address: 'Bloco A, Térreo', active: true },
    { id: '2', name: 'Biblioteca de Engenharia', address: 'Bloco E, 2º Andar', active: true },
    { id: '3', name: 'Biblioteca de Humanas', address: 'Bloco H, Térreo', active: true },
  ];

  private users: User[] = [
    {
      id: '1',
      name: 'Gustavo de Lima',
      email: 'gustavo.lima@ifpe.edu.br',
      phone: '(11) 99999-0001',
      enrollment: '2024001',
      type: 'STUDENT',
      avatarUrl: null,
      libraryId: '1',
      createdAt: new Date('2024-01-15'),
      active: true,
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@ifpe.edu.br',
      phone: '(11) 98888-0002',
      enrollment: '2023045',
      type: 'PROFESSOR',
      avatarUrl: null,
      libraryId: '1',
      createdAt: new Date('2023-03-10'),
      active: true,
    },
    {
      id: '3',
      name: 'Carlos Santos',
      email: 'carlos.santos@ifpe.edu.br',
      phone: '(11) 97777-0003',
      enrollment: '2024102',
      type: 'STUDENT',
      avatarUrl: null,
      libraryId: '2',
      createdAt: new Date('2024-02-20'),
      active: true,
    },
  ];

  private books: Book[] = [
    {
      id: '1',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      publisher: 'Prentice Hall',
      year: 2008,
      category: 'TECHNOLOGY',
      totalCopies: 3,
      availableCopies: 1,
      libraryId: '1',
      coverUrl: null,
      description: 'Guia prático para escrever código limpo e manutenível.',
    },
    {
      id: '2',
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      isbn: '978-0201633610',
      publisher: 'Addison-Wesley',
      year: 1994,
      category: 'TECHNOLOGY',
      totalCopies: 2,
      availableCopies: 0,
      libraryId: '1',
      coverUrl: null,
      description: 'O clássico livro sobre padrões de projeto orientado a objetos.',
    },
    {
      id: '3',
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      author: 'J.R.R. Tolkien',
      isbn: '978-8595084742',
      publisher: 'HarperCollins',
      year: 1954,
      category: 'LITERATURE',
      totalCopies: 5,
      availableCopies: 3,
      libraryId: '2',
      coverUrl: null,
      description: 'O primeiro volume da trilogia épica de fantasia.',
    },
    {
      id: '4',
      title: 'Cálculo Volume 1',
      author: 'James Stewart',
      isbn: '978-8522125838',
      publisher: 'Cengage Learning',
      year: 2013,
      category: 'MATHEMATICS',
      totalCopies: 10,
      availableCopies: 6,
      libraryId: '1',
      coverUrl: null,
      description: 'Livro-texto clássico de cálculo diferencial e integral.',
    },
    {
      id: '5',
      title: 'Engenharia de Software',
      author: 'Ian Sommerville',
      isbn: '978-8543024974',
      publisher: 'Pearson',
      year: 2018,
      category: 'ENGINEERING',
      totalCopies: 4,
      availableCopies: 2,
      libraryId: '1',
      coverUrl: null,
      description: 'Referência completa em engenharia de software moderna.',
    },
    {
      id: '6',
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      isbn: '978-8525406835',
      publisher: 'Companhia das Letras',
      year: 1899,
      category: 'LITERATURE',
      totalCopies: 3,
      availableCopies: 3,
      libraryId: '3',
      coverUrl: null,
      description: 'Um dos maiores clássicos da literatura brasileira.',
    },
  ];

  private loans: Loan[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Gustavo de Lima',
      bookId: '1',
      bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      loanDate: new Date('2026-05-01'),
      dueDate: new Date('2026-05-15'),
      returnDate: new Date('2026-05-14'),
      status: 'RETURNED',
      libraryId: '1',
      acceptedBy: 'Ana Souza (Bibliotecária)',
    },
    {
      id: '2',
      userId: '1',
      userName: 'Gustavo de Lima',
      bookId: '5',
      bookTitle: 'Engenharia de Software',
      loanDate: new Date('2026-05-10'),
      dueDate: new Date('2026-05-24'),
      returnDate: null,
      status: 'ACTIVE',
      libraryId: '1',
      acceptedBy: 'Marcos Santos (Bibliotecário)',
    },
    {
      id: '3',
      userId: '2',
      userName: 'Maria Oliveira',
      bookId: '2',
      bookTitle: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      loanDate: new Date('2026-04-20'),
      dueDate: new Date('2026-05-04'),
      returnDate: null,
      status: 'OVERDUE',
      libraryId: '1',
      acceptedBy: 'Juliana Rocha (Administradora)',
    },
    {
      id: '4',
      userId: '3',
      userName: 'Carlos Santos',
      bookId: '3',
      bookTitle: 'O Senhor dos Anéis: A Sociedade do Anel',
      loanDate: new Date('2026-05-18'),
      dueDate: new Date('2026-06-01'),
      returnDate: null,
      status: 'ACTIVE',
      libraryId: '2',
      acceptedBy: 'Ana Souza (Bibliotecária)',
    },
  ];

  private waitlistEntries: WaitlistEntry[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Gustavo de Lima',
      bookId: '2',
      bookTitle: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      position: 1,
      entryDate: new Date('2026-07-01'),
      status: 'AGUARDANDO',
    },
    {
      id: '2',
      userId: '3',
      userName: 'Carlos Santos',
      bookId: '2',
      bookTitle: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      position: 2,
      entryDate: new Date('2026-07-03'),
      status: 'AGUARDANDO',
    },
  ];

  private notifications: AppNotification[] = [
    {
      id: '1',
      userId: '1',
      title: 'Empréstimo vencendo!',
      message: 'O livro "Engenharia de Software" vence em 2 dias. Renove ou devolva para evitar multas.',
      type: 'EMPRESTIMO_VENCENDO',
      read: false,
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      userId: '1',
      title: 'Livro disponível!',
      message: 'O livro "Design Patterns" está disponível para empréstimo. Você era o próximo da fila.',
      type: 'LIVRO_DISPONIVEL',
      read: false,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      userId: '2',
      title: 'Empréstimo atrasado!',
      message: 'O livro "Design Patterns" está com a devolução atrasada. Devolva o quanto antes.',
      type: 'EMPRESTIMO_ATRASADO',
      read: true,
      createdAt: new Date(Date.now() - 172800000),
    },
  ];

  getLibraries(): Library[] {
    return this.libraries;
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getBooks(): Book[] {
    return this.books;
  }

  getBookById(id: string): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  addLog(action: string): void {
    this.logs.unshift({ action, timestamp: new Date() });
  }

  getLogs(): { action: string; timestamp: Date }[] {
    return this.logs;
  }

  addBook(book: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      ...book,
      id: String(this.books.length + 1),
    };
    this.books.push(newBook);
    this.addLog(`Livro "${newBook.title}" adicionado ao acervo.`);
    return newBook;
  }

  updateBook(id: string, updatedBook: Partial<Book>): Book | undefined {
    const book = this.books.find((b) => b.id === id);
    if (book) {
      Object.assign(book, updatedBook);
      this.addLog(`Livro "${book.title}" atualizado.`);
    }
    return book;
  }

  deleteBook(id: string): boolean {
    const index = this.books.findIndex((b) => b.id === id);
    if (index !== -1) {
      const title = this.books[index].title;
      this.books.splice(index, 1);
      this.addLog(`Livro "${title}" removido do acervo.`);
      return true;
    }
    return false;
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: String(this.users.length + 1),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    this.addLog(`Membro "${newUser.name}" cadastrado.`);
    return newUser;
  }

  updateUser(id: string, updatedUser: Partial<User>): User | undefined {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      Object.assign(user, updatedUser);
      this.addLog(`Membro "${user.name}" atualizado.`);
    }
    return user;
  }

  toggleUserStatus(id: string): User | undefined {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      user.active = !user.active;
      const statusText = user.active ? 'desbloqueado' : 'bloqueado';
      this.addLog(`Membro "${user.name}" foi ${statusText}.`);
    }
    return user;
  }

  addLoan(loan: Omit<Loan, 'id'>): Loan {
    const newLoan: Loan = {
      ...loan,
      id: String(this.loans.length + 1),
    };
    this.loans.push(newLoan);

    const book = this.books.find((b) => b.id === newLoan.bookId);
    if (book && book.availableCopies > 0) {
      book.availableCopies--;
    }

    this.addLog(`Empréstimo do livro "${newLoan.bookTitle}" para "${newLoan.userName}" registrado.`);
    return newLoan;
  }

  returnLoan(id: string): Loan | undefined {
    const loan = this.loans.find((l) => l.id === id);
    if (loan && loan.status !== 'RETURNED') {
      loan.status = 'RETURNED';
      loan.returnDate = new Date();

      const book = this.books.find((b) => b.id === loan.bookId);
      if (book) {
        book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      }

      this.addLog(`Livro "${loan.bookTitle}" devolvido por "${loan.userName}".`);
    }
    return loan;
  }

  renewLoan(id: string): Loan | undefined {
    const loan = this.loans.find((l) => l.id === id);
    if (loan && (loan.status === 'ACTIVE' || loan.status === 'OVERDUE')) {
      const newDueDate = new Date(loan.dueDate);
      newDueDate.setDate(newDueDate.getDate() + 14);
      loan.dueDate = newDueDate;
      loan.status = 'ACTIVE';
      this.addLog(`Empréstimo do livro "${loan.bookTitle}" para "${loan.userName}" renovado por 14 dias.`);
    }
    return loan;
  }

  getLoans(): Loan[] {
    return [...this.loans];
  }

  getLoansByUserId(userId: string): Loan[] {
    return this.loans.filter((l) => l.userId === userId);
  }

  getStats(): { totalBooks: number; totalUsers: number; activeLoans: number; overdueLoans: number } {
    return {
      totalBooks: this.books.length,
      totalUsers: this.users.length,
      activeLoans: this.loans.filter((l) => l.status === 'ACTIVE').length,
      overdueLoans: this.loans.filter((l) => l.status === 'OVERDUE').length,
    };
  }

  getUserStats(userId: string): { totalLoans: number; activeLoans: number; overdueLoans: number; returnedLoans: number } {
    const userLoans = this.getLoansByUserId(userId);
    return {
      totalLoans: userLoans.length,
      activeLoans: userLoans.filter((l) => l.status === 'ACTIVE').length,
      overdueLoans: userLoans.filter((l) => l.status === 'OVERDUE').length,
      returnedLoans: userLoans.filter((l) => l.status === 'RETURNED').length,
    };
  }

  getWaitlistByBook(bookId: string): WaitlistEntry[] {
    return this.waitlistEntries.filter(w => w.bookId === bookId && w.status === 'AGUARDANDO');
  }

  getWaitlistByUser(userId: string): WaitlistEntry[] {
    return this.waitlistEntries.filter(w => w.userId === userId);
  }

  joinWaitlist(bookId: string, userId: string): WaitlistEntry {
    const user = this.users.find(u => u.id === userId);
    const book = this.books.find(b => b.id === bookId);
    const currentQueue = this.getWaitlistByBook(bookId);
    const entry: WaitlistEntry = {
      id: String(this.waitlistEntries.length + 1),
      userId,
      userName: user?.name || '',
      bookId,
      bookTitle: book?.title || '',
      position: currentQueue.length + 1,
      entryDate: new Date(),
      status: 'AGUARDANDO',
    };
    this.waitlistEntries.push(entry);
    this.addLog(`"${entry.userName}" entrou na fila de espera do livro "${entry.bookTitle}".`);
    return entry;
  }

  leaveWaitlist(id: string): void {
    const entry = this.waitlistEntries.find(w => w.id === id);
    if (entry) {
      entry.status = 'CANCELADO';
      this.addLog(`"${entry.userName}" saiu da fila de espera do livro "${entry.bookTitle}".`);
    }
  }

  isUserInWaitlist(bookId: string, userId: string): WaitlistEntry | undefined {
    return this.waitlistEntries.find(w => w.bookId === bookId && w.userId === userId && w.status === 'AGUARDANDO');
  }

  getNotifications(userId: string): AppNotification[] {
    return this.notifications.filter(n => n.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  markNotificationAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
    }
  }

  markAllNotificationsAsRead(userId: string): void {
    this.notifications.filter(n => n.userId === userId).forEach(n => n.read = true);
  }
}
