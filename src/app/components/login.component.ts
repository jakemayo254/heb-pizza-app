import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div
      id="app-login"
      data-testid="app-login"
      class="flex items-center justify-center min-h-screen bg-heb-light-grey"
    >
      <div class="flex flex-col items-center space-y-4">
        <img src="hebLogo.png" alt="H-E-B Logo" class="w-44 h-auto" />
        <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl text-center mb-4">Pizza App Login</h2>
          <form #loginForm="ngForm" (ngSubmit)="requestAuthToken()" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input
                required
                type="text"
                id="username"
                name="username"
                [(ngModel)]="username"
                placeholder="Enter your username"
                class="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="relative mt-1">
                <input
                  required
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  placeholder="Enter your password"
                  class="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  (click)="togglePasswordVisibility()"
                  aria-label="Toggle password visibility"
                >
                  {{ showPassword ? '👁️‍🗨️' : '👁️' }}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                [disabled]="loginForm.invalid"
                [style.cursor]="loginForm.invalid ? 'not-allowed' : 'pointer'"
                class="w-full bg-heb-gray-2 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  username = null;
  password = null;
  showPassword = false;

  constructor(private authState: AuthStateService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  requestAuthToken(): void {
    if (this.username != null && this.password != null)
      this.authState.setAuthToken(this.username, this.password);
  }
}
