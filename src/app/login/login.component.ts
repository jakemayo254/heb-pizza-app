import { Component } from '@angular/core';
import { PizzaApiService } from '../services/pizza-api.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {AuthStateService} from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = null;
  password = null;
  showPassword = false;

  constructor(private pizzaService: PizzaApiService, private toast: ToastrService, private authState: AuthStateService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  requestAuthToken(): void {
    if (this.username != null && this.password != null)
      this.authState.setAuthToken(this.username, this.password);
  }
}
