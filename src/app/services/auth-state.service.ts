import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '@src/app/models/auth.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  public username: string | null = null;

  constructor(
    private readonly pizzaAPIService: PizzaApiService,
    private readonly toast: ToastrService
  ) {
    // Restore username from localStorage (optional)
    const storedUsername = localStorage.getItem('authUsername');
    const token = localStorage.getItem('authToken');

    if (token && token !== 'null' && token !== '') {
      this.username = storedUsername;
    }
  }

  setAuthToken(username: string, password: string): Observable<HttpResponse<AuthResponse>> {
    if (!username || !password) {
      this.toast.error('Username and password are required', 'Error');
      return throwError(() => new Error('Missing credentials'));
    }

    this.username = username;

    return this.pizzaAPIService.getAuthToken(username, password).pipe(
      tap((res): void => {
        const token = res.body?.access_token;
        if (!token) {
          console.warn('Auth token missing in response body');
        }

        localStorage.setItem('authToken', token ?? '');
        localStorage.setItem('authUsername', username);
      }),
      catchError((err): Observable<never> => {
        const errorHeader = err.status === 400 ? 'Error' : 'Unauthorized';
        this.toast.error(err.error?.msg || 'Unknown error', errorHeader);
        console.error('Auth error:', err);
        return throwError(() => err);
      })
    );
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUsername(): string | null {
    return localStorage.getItem('authUsername');
  }

  clearAuth(): void {
    this.username = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUsername');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token && token !== 'null' && token !== '';
  }
}
