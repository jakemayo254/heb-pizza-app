import { HttpResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@src/app/models/auth.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authKey = 'authToken';
  private readonly userKey = 'authUsername';
  private readonly _authToken = signal<string | null>(null);
  private readonly _userName = signal<string | null>(null);
  public readonly authToken = this._authToken.asReadonly();
  public readonly userName = this._userName.asReadonly();

  public readonly isAuthenticated = computed(
    (): boolean => !!this._authToken() && this._authToken() !== 'null' && this._authToken() !== ''
  );

  constructor(
    private readonly pizzaAPIService: PizzaApiService,
    private readonly toast: ToastrService
  ) {
    const savedToken = localStorage.getItem(this.authKey);
    const savedUser = localStorage.getItem(this.userKey);

    if (savedToken && savedToken !== 'null' && savedToken !== '') {
      this._authToken.set(savedToken);
    }

    if (savedUser && savedUser !== 'null' && savedUser !== '') {
      this._userName.set(savedUser);
    }
  }

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
          this._authToken.set(token);
          this._userName.set(username);
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

  clearAuth(): void {
    localStorage.removeItem(this.authKey);
    localStorage.removeItem(this.userKey);
    this._authToken.set(null);
    this._userName.set(null);
  }
}
