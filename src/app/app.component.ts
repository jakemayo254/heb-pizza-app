import { Component } from '@angular/core';
import {LoginComponent} from '@src/app/components/login.component';
import {AuthStateService} from '@src/app/services/auth-state.service';
import {HomeComponent} from '@src/app/components/home.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, LoginComponent, HomeComponent],
  template: `
    <app-login *ngIf="!authState.isAuthenticated()"></app-login>
    <app-home *ngIf="authState.isAuthenticated()"></app-home>
  `,
})
export class AppComponent {
  constructor(protected authState: AuthStateService) { }
}
