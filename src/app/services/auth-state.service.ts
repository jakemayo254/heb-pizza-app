import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest, AuthResponse } from '@src/app/models/auth.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  public authDetails: AuthRequest | null = null;
  public authToken: string | null = null;

  constructor(
    private readonly pizzaAPIService: PizzaApiService,
    private readonly toast: ToastrService
  ) {}

  setAuthToken(username: string, password: string): Observable<HttpResponse<AuthResponse>> {
    if (!username || !password) {
      this.toast.error('Username and password are required', 'Error');
      return throwError(() => new Error('Missing credentials'));
    }

    this.authDetails = { username, password };

    return this.pizzaAPIService.getAuthToken(this.authDetails).pipe(
      tap((res): void => {
        const token = res.body?.access_token;
        if (!token) {
          console.warn('Auth token missing in response body');
        }
        this.authToken = token ?? null;
      }),
      catchError((err): Observable<never> => {
        const errorHeader = err.status === 400 ? 'Error' : 'Unauthorized';
        this.toast.error(err.error?.msg || 'Unknown error', errorHeader);
        console.error('Auth error:', err);
        return throwError(() => err);
      })
    );
  }

  resetAuthToken(): Observable<HttpResponse<AuthResponse>> {
    if (!this.authDetails) {
      this.toast.warning('No saved auth details to refresh token.', 'Warning');
      return throwError(() => new Error('No auth details available'));
    }
    return this.setAuthToken(this.authDetails.username, this.authDetails.password);
  }

  clearAuth(): void {
    this.authDetails = null;
    this.authToken = null;
  }

  isAuthenticated(): boolean {
    return !!this.authToken;
  }
}
