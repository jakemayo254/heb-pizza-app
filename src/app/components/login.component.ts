import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dataTestID } from '@src/app/constants/data-test-id';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
          <form [formGroup]="loginForm" (ngSubmit)="requestAuthToken()" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                [attr.data-testid]="dataTestID.loginUserName"
                placeholder="Enter your username"
                class="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div
                *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                class="mt-1 text-sm text-red-500"
              >
                Username is required.
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="relative mt-1">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  [attr.data-testid]="dataTestID.loginPassword"
                  placeholder="Enter your password"
                  class="w-full rounded border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  [attr.data-testid]="dataTestID.loginShowPassword"
                  aria-label="Toggle password visibility"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {{ showPassword() ? '👁️‍🗨️' : '👁️' }}
                </button>
              </div>
              <div
                *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                class="mt-1 text-sm text-red-500"
              >
                Password is required.
              </div>
            </div>

            <div>
              <button
                type="submit"
                [attr.data-testid]="dataTestID.loginButton"
                [disabled]="loginForm.invalid || loading()"
                [style.cursor]="loginForm.invalid || loading() ? 'not-allowed' : 'pointer'"
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
  protected readonly showPassword = signal(false);
  protected readonly loading = signal(false);
  protected loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value): boolean => !value);
  }

  // setAuthToken = returns an Observable
  // RxJS Reactive Extensions for JavaScript
  // pipe = chain RxJS operations that can transform, filter, or react to the observable
  // subscribe = triggers the observable
  // next = runs when the observable emits a value successfully
  // error = runs if the observable fails
  // finalize = is run when the observable is complete
  protected requestAuthToken(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.loading.set(true);
    this.authState
      .setAuthToken(username.trim(), password.trim())
      .pipe(finalize((): void => this.loading.set(false)))
      .subscribe({
        next: (): void => console.log('login success'),
        error: (): void => console.error('failed login'),
      });
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
