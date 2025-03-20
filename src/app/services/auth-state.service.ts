import { Injectable } from '@angular/core';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { AuthRequest } from '@src/app/models/auth.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  authDetails: AuthRequest | null = null;
  authToken: string | null = null;

  constructor(private pizzaAPIService: PizzaApiService, private toast: ToastrService) {}

  private getAuthToken(): void {
    if (this.authDetails != null) {
      this.pizzaAPIService.getAuthToken(this.authDetails).subscribe({
        next: (res) => {
          this.authToken = res.body?.access_token ?? null;
        },
        error: (err) => {
          if (err.status === 400) {
            this.toast.error(err.error.msg, "Error");
          } else {
            this.toast.error(err.error.msg, "Unauthorized");
          }
        }
      });
    }
  }

  setAuthToken(username: string, password: string): void {
    this.authDetails = {
      username,
      password,
    }

    this.getAuthToken();
  }

  resetAuthToken(): void {
    this.getAuthToken();
  }

  clearAuth(): void {
    this.authDetails = null;
    this.authToken = null;
  }

  isAuthenticated(): boolean {
    // check to see if it exists and not falsy
    return !!this.authToken;
  }
}
