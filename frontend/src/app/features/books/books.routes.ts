import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list.component';

export const BOOKS_ROUTES: Routes = [
  { path: '', component: BookListComponent },
];
