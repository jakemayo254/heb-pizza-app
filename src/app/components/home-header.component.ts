import { Component } from '@angular/core';
import { dataTestID } from '@src/app/models/data-test-id';
import { AuthStateService } from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-home-header',
  imports: [],
  template: `
    <header [attr.data-testid]="dataTestID.appHomeHeader" class="bg-heb-red w-full p-4 text-white">
      <div class="flex items-center justify-between">
        <!-- Left: Home Title -->
        <div class="flex w-full justify-center md:w-auto md:justify-start">
          <img src="hebLogo.png" alt="H-E-B Logo" class="h-auto w-44" />
        </div>

        <!-- Desktop Right Section -->
        <div class="ml-auto hidden items-center gap-4 md:flex">
          <span>Welcome, {{ authState.authDetails?.username }}</span>
          <button
            type="button"
            [attr.data-testid]="dataTestID.logoutButton"
            (click)="logOut()"
            style="cursor: pointer;"
            class="text-heb-text-gray rounded bg-white px-3 py-1 transition hover:bg-gray-200"
          >
            Log Out
          </button>
        </div>

        <!-- Mobile Dropdown Menu -->
        <div class="ml-auto md:hidden">
          <details class="relative">
            <summary
              [attr.data-testid]="dataTestID.mobileHamburger"
              class="flex cursor-pointer list-none items-center gap-2 text-2xl"
            >
              ☰
            </summary>
            <ul class="text-heb-text-gray absolute right-0 z-10 mt-2 w-40 rounded bg-white shadow-lg">
              <li class="border-b border-gray-200 px-4 py-2">Welcome, {{ authState.authDetails?.username }}</li>
              <li class="px-4 py-2 hover:bg-gray-100">
                <button
                  type="button"
                  [attr.data-testid]="dataTestID.mobileLogoutButton"
                  (click)="logOut()"
                  class="w-full cursor-pointer text-left"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  `,
})
export class HomeHeaderComponent {
  protected readonly dataTestID = dataTestID;

  constructor(protected authState: AuthStateService) {}

  logOut(): void {
    this.authState.clearAuth();
  }
}
