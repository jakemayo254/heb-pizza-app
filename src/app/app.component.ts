import { Component } from '@angular/core';
import {LoginComponent} from '@src/app/login/login.component';
import {AuthStateService} from '@src/app/services/auth-state.service';
import {HomeComponent} from '@src/app/home/home.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, LoginComponent, HomeComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(protected authState: AuthStateService) { }
}
