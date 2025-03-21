import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dataTestID } from '@src/app/constants/data-test-id';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div
      id="app-login"
      [attr.data-testid]="dataTestID.appLogin"
      class="bg-heb-light-grey flex min-h-screen items-center justify-center p-4"
    >
      <div class="flex flex-col items-center space-y-4">
        <img src="hebLogo.png" alt="H-E-B Logo" class="h-auto w-44" />
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-center text-xl">Pizza App Login</h2>
          <form #loginForm="ngForm" (ngSubmit)="requestAuthToken()" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                [attr.data-testid]="dataTestID.loginUserName"
                [(ngModel)]="username"
                required
                placeholder="Enter your username"
                class="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="relative mt-1">
                <input
                  id="password"
                  name="password"
                  [attr.data-testid]="dataTestID.loginPassword"
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  required
                  placeholder="Enter your password"
                  class="w-full rounded border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  [attr.data-testid]="dataTestID.loginShowPassword"
                  (click)="togglePasswordVisibility()"
                  aria-label="Toggle password visibility"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {{ showPassword ? '👁️‍🗨️' : '👁️' }}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                [attr.data-testid]="dataTestID.loginButton"
                [disabled]="loginForm.invalid || loading"
                [style.cursor]="loginForm.invalid || loading ? 'not-allowed' : 'pointer'"
                class="bg-heb-gray-2 w-full rounded py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
              >
                <span *ngIf="loading">Loading...</span>
                <span *ngIf="!loading">Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  protected readonly dataTestID = dataTestID;
  username = null;
  password = null;
  showPassword = false;
  loading = false;

  constructor(private readonly authState: AuthStateService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  requestAuthToken(): void {
    if (this.username && this.password) {
      this.loading = true;

      this.authState
        .setAuthToken(this.username, this.password)
        .pipe(finalize((): boolean => (this.loading = false)))
        .subscribe({
          next: (): void => {
            console.log('login success');
          },
          error: (): void => {
            console.error('failed login success');
          },
        });
    }
  }
}
