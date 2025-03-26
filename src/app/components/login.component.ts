import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dataTestID } from '@src/app/constants/data-test-id';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      id="app-login"
      [attr.data-testid]="dataTestID.appLogin"
      class="bg-heb-light-grey flex min-h-screen items-center justify-center p-4"
    >
      <div class="flex flex-col items-center space-y-4">
        <img src="heb-logo.png" alt="H-E-B Logo" class="h-auto w-44" />
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
                [ngModel]="username()"
                (ngModelChange)="username.set($event)"
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
                  [type]="showPassword() ? 'text' : 'password'"
                  [ngModel]="password()"
                  (ngModelChange)="password.set($event)"
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
                  {{ showPassword() ? '👁️‍🗨️' : '👁️' }}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                [attr.data-testid]="dataTestID.loginButton"
                [disabled]="isDisabled()"
                [style.cursor]="isDisabled() ? 'not-allowed' : 'pointer'"
                class="bg-heb-gray-2 w-full rounded py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
              >
                <span *ngIf="loading()">Loading...</span>
                <span *ngIf="!loading()">Login</span>
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
  protected readonly username = signal<string | null>(null);
  protected readonly password = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly loading = signal(false);

  protected readonly isDisabled = computed((): boolean => {
    return !this.username() || !this.password() || this.loading();
  });

  constructor(private readonly authState: AuthStateService) {}

  togglePasswordVisibility(): void {
    this.showPassword.update((value): boolean => !value);
  }

  requestAuthToken(): void {
    const username = this.username();
    const password = this.password();

    // setAuthToken = returns an Observable
    // RxJS Reactive Extensions for JavaScript
    // pipe = chain RxJS operations that can transform, filter, or react to the observable
    // subscribe = triggers the observable
    // next = runs when the observable emits a value successfully
    // error = runs if the observable fails
    // finalize = is run when the observable is complete
    if (username && password) {
      this.loading.set(true);
      this.authState
        .setAuthToken(username, password)
        .pipe(finalize((): void => this.loading.set(false)))
        .subscribe({
          next: (): void => console.log('login success'),
          error: (): void => console.error('failed login'),
        });
    }
  }
}

// justify-center = it centers flex items horizontally (along the main axis) inside a flex container
// space-y-4 = adds vertical spacing between child elements. no spacing on top of first child
// or below the last child
// h-auto = the height will be set by child element
// w-44 = fixed width
// max-w-md = sets the maximum width of an element to 448px
// shadow-md = applies a medium-level box shadow for elevation and visual depth
// block = sets the elements display mode to block. the element will take up the full width of its
// parents container
