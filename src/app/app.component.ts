import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeComponent } from '@src/app/components/home.component';
import { LoginComponent } from '@src/app/components/login.component';
import { AuthStateService } from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, LoginComponent, HomeComponent],
  template: `
    <app-login *ngIf="!authState.isAuthenticated()" />
    <app-home *ngIf="authState.isAuthenticated()" />
  `,
})
export class AppComponent {
  constructor(protected readonly authState: AuthStateService) {}
}
