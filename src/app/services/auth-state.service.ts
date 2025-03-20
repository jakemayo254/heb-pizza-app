import { Injectable } from '@angular/core';
import {PizzaService} from '@src/app/services/pizza.service';
import {AuthRequest} from '@src/app/models/auth.model';
import {ToastrService} from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  username: string | null = null;
  password: string | null = null;
  authToken: string | null = null;

  constructor(private pizzaService: PizzaService, private toast: ToastrService) {}

  setAuthToken(username: string, password: string): void {
    this.username = username;
    this.password = password;

    const authRequest: AuthRequest = {
      username,
      password,
    }

    this.pizzaService.getAuthToken(authRequest).subscribe({
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

  resetAuthToken(): void {
    const authRequest: AuthRequest = {
      username: this.username ?? "",
      password: this.password ?? "",
    }

    this.pizzaService.getAuthToken(authRequest).subscribe({
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

  clearAuth(): void {
    this.username = null;
    this.password = null;
    this.authToken = null;
  }

  isAuthenticated(): boolean {
    // check to see if it exists and not falsy
    return !!this.authToken;
  }
}
