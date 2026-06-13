import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = authService.getAccessToken();
  const isApiGatewayRequest = environment.apiGatewayUrl
    ? request.url.startsWith(environment.apiGatewayUrl)
    : request.url.startsWith('/api/');

  if (!isApiGatewayRequest) {
    return next(request);
  }

  const apiRequest = accessToken
    ? request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    : request;

  return next(apiRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        authService.logout();
        void router.navigateByUrl('/login');
      }

      return throwError(() => error);
    })
  );
};
