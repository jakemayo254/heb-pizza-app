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

  // If the dropdown is visible during mobile view and the user goes to desktop view
  // it will reset it to not be open so when the user goes back to mobile it will be
  // hidden and the user will have to click the hamburger again
  ngAfterViewInit(): void {
    // Optional: Initially ensure dropdown is closed
    this.mobileDropdownRef?.nativeElement.removeAttribute('open');
  }

  // listens to DOM events within the header component
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    if (width >= 768) {
      // If resizing to desktop view, close mobile dropdown if open
      this.mobileDropdownRef?.nativeElement.removeAttribute('open');
    }
  }
}

// w-full = element will stretch to fill the entire width of its parent container
// px-4 = padding left and right of
// py-6 = padding top and bottom
// padding = space inside an element
// margin = space outside an element
// justify-between = put end items at end and even spacing between them
// absolute = position the element absolutely relative to its nearest positioned ancestor
// left-1/2 = move the elements left edge to the center of the parent container 50%
// -translate-x-1/2 = shift the element left by 50% of its own width. perfectly centers it
// md: = medium break
// static = back to normal document flow
// border-b = border-bottom-width. adds a 1-pixel bottom border
// right-0 = positions the element flush to the right edge of its parent container
// z-10 = ensures it appears above other elements. so the dropdown isn't hidden
// ml-auto = adds left margin: auto, which pushes the element to the far right of its container
// hidden = hides the element by default
// gap-4 = adds a gap between children
