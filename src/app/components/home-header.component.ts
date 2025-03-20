import { Component } from '@angular/core';
import { AuthStateService } from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-home-header',
  imports: [],
  template: `
    <header class="w-full bg-heb-red text-white p-4">
      <div class="flex items-center justify-between">
        <!-- Left: Home Title -->
        <div class="w-full md:w-auto flex justify-center md:justify-start">
          <img src="hebLogo.png" alt="H-E-B Logo" class="w-44 h-auto" />
        </div>

        <!-- Desktop Right Section -->
        <div class="hidden md:flex items-center gap-4 ml-auto">
          <span>Welcome, {{ authState.authDetails?.username }}</span>
          <button
            type="button"
            (click)="logOut()"
            style="cursor: pointer;"
            class="bg-white text-heb-text-gray px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Log Out
          </button>
        </div>

        <!-- Mobile Dropdown Menu -->
        <div class="md:hidden ml-auto">
          <details class="relative">
            <summary class="cursor-pointer list-none flex items-center gap-2 text-2xl">☰</summary>
            <ul class="absolute right-0 mt-2 bg-white text-heb-text-gray rounded shadow-lg w-40 z-10">
              <li class="px-4 py-2 border-b border-gray-200">Welcome, {{ authState.authDetails?.username }}</li>
              <li class="px-4 py-2 hover:bg-gray-100">
                <button (click)="logOut()" class="w-full text-left cursor-pointer">Log Out</button>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  `,
})
export class HomeHeaderComponent {
  constructor(protected authState: AuthStateService) {}

  logOut(): void {
    this.authState.clearAuth();
  }
}
