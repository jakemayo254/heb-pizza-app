import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

// ApplicationConfig = used to bootstrap the with a more lightweight and modular approach
// appConfig = is passed into the bootstrapApplication() in main.ts
export const appConfig: ApplicationConfig = {
  // standalone application setup. services or features Angular will inject into the app globally
  providers: [
    // enables zone-based change detection
    // eventCoalescing merges multiple DOM events into a single change detection cycle
    provideZoneChangeDetection({ eventCoalescing: true }),
    // sets up the Angular Router with app's routes. It makes routing work with RouterOutlet, RouterLink
    provideRouter(routes),
    // Provides Angular HttpClient service, which is used to make HTTP requests
    provideHttpClient(),
    // enables Angular animations, for route transitions, expanding elements
    provideAnimations(),
    // for Toast notifications
    provideToastr(),
  ],
};
