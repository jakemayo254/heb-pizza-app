import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {AuthStateService} from '@src/app/services/auth-state.service';
import {fetchAuthToken} from '@src/app/utils/auth-token-fetcher';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = null;
  password = null;
  showPassword = false;

  constructor(private pizzaService: PizzaService, private toast: ToastrService, private authState: AuthStateService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  requestAuthToken(): void {
    fetchAuthToken(this.pizzaService, this.authState, this.toast, this.username, this.password);
  }
}
