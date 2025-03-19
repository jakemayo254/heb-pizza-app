import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  username: string | null = null;
  password: string | null = null;
  authToken: string | null = null;

  setAuth(username: string | null, password: string | null, authToken: string | null): void {
    this.username = username;
    this.password = password;
    this.authToken = authToken;
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
