import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest, AuthResponse } from '@src/app/models/auth.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  authDetails: AuthRequest | null = null;
  authToken: string | null = null;

  constructor(
    private pizzaAPIService: PizzaApiService,
    private toast: ToastrService
  ) {}

  setAuthToken(username: string, password: string): Observable<HttpResponse<AuthResponse>> {
    this.authDetails = { username, password };

    return this.pizzaAPIService.getAuthToken(this.authDetails).pipe(
      tap((res) => {
        this.authToken = res.body?.access_token ?? null;
      }),
      catchError((err) => {
        const errorHeader = err.status === 400 ? 'Error' : 'Unauthorized';
        this.toast.error(err.error?.msg || 'Unknown error', errorHeader);
        return throwError(() => err); // rethrow so the component can handle error state
      })
    );
  }

  resetAuthToken(): Observable<HttpResponse<AuthResponse>> {
    if (this.authDetails) {
      return this.setAuthToken(this.authDetails.username, this.authDetails.password);
    }
    return throwError(() => new Error('No auth details available'));
  }

  clearAuth(): void {
    this.authDetails = null;
    this.authToken = null;
  }

  isAuthenticated(): boolean {
    return !!this.authToken;
  }
}
