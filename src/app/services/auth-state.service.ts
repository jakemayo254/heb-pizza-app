import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '@src/app/models/auth.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authKey = 'authToken';
  private readonly userKey = 'authUsername';

  constructor(
    private readonly pizzaAPIService: PizzaApiService,
    private readonly toast: ToastrService
  ) {}

  setAuthToken(username: string, password: string): Observable<HttpResponse<AuthResponse>> {
    if (!username || !password) {
      this.toast.error('Username and password are required', 'Error');
      return throwError((): Error => new Error('Missing credentials'));
    }

    return this.pizzaAPIService.getAuthToken(username, password).pipe(
      tap((res): void => {
        const token = res.body?.access_token;
        if (!token) {
          console.warn('Auth token missing in response body');
        } else {
          localStorage.setItem(this.authKey, token);
          localStorage.setItem(this.userKey, username);
        }
      }),
      catchError((err): Observable<never> => {
        const errorHeader = err.status === 400 ? 'Error' : 'Unauthorized';
        this.toast.error(err.error?.msg || 'Unknown error', errorHeader);
        console.error('Auth error:', err);
        return throwError(() => err);
      })
    );
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userKey);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authKey);
  }

  clearAuth(): void {
    localStorage.removeItem(this.authKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.authKey);
    return !!token && token !== 'null' && token !== '';
  }
}
