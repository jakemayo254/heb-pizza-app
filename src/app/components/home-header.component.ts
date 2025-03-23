import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { dataTestID } from '@src/app/constants/data-test-id';
import { AuthStateService } from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-home-header',
  imports: [],
  template: `
    <header [attr.data-testid]="dataTestID.appHomeHeader" class="bg-heb-red w-full px-4 py-6 text-white">
      <div class="flex items-center justify-between">
        <!-- HEB Logo -->
        <div class="absolute left-1/2 -translate-x-1/2 md:static md:left-0 md:translate-x-0">
          <img src="hebLogo.png" alt="H-E-B Logo" class="h-auto w-44" />
        </div>

        <!-- Desktop View Right Section -->
        <div class="ml-auto hidden items-center gap-4 md:flex">
          <span>Welcome, {{ authState.getUserName() }}</span>
          <button
            type="button"
            [attr.data-testid]="dataTestID.logoutButton"
            (click)="logOut()"
            class="text-heb-text-gray cursor-pointer rounded bg-white px-3 py-1 transition hover:bg-gray-200"
          >
            Log Out
          </button>
        </div>

        <!-- Mobile View Dropdown Menu -->
        <div class="ml-auto md:hidden">
          <details class="relative" #mobileDropdown>
            <summary
              [attr.data-testid]="dataTestID.mobileHamburger"
              class="flex cursor-pointer list-none items-center gap-2 text-2xl"
            >
              ☰
            </summary>
            <ul class="text-heb-text-gray absolute right-0 z-10 mt-2 w-40 rounded bg-white shadow-lg">
              <li class="border-b border-gray-200 px-4 py-2">Welcome, {{ authState.getUserName() }}</li>
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
export class HomeHeaderComponent implements AfterViewInit {
  protected readonly dataTestID = dataTestID;

  @ViewChild('mobileDropdown') mobileDropdownRef!: ElementRef<HTMLDetailsElement>;

  constructor(protected authState: AuthStateService) {}

  logOut(): void {
    this.authState.clearAuth();
  }

  ngAfterViewInit(): void {
    // Optional: Initially ensure dropdown is closed
    this.mobileDropdownRef?.nativeElement.removeAttribute('open');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    if (width >= 768) {
      // If resizing to desktop view, close mobile dropdown if open
      this.mobileDropdownRef?.nativeElement.removeAttribute('open');
    }
  }
}
