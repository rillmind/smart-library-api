import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const injector = inject(Injector);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if ((error.status === 401 || error.status === 403) && 
          !req.url.includes('/api/user/login') && 
          !req.url.includes('/api/user/logout')) {
        
        localStorage.removeItem('sl_user');
        localStorage.removeItem('sl_role');
        
        try {
          const authService = injector.get(AuthService);
          authService.currentUser.set(null);
          authService.userRole.set(null);
        } catch (e) {}

        router.navigate(['/auth/login']);
      }

      snackBar.open(errorMessage, 'Fechar', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });

      return throwError(() => error);
    })
  );
};
