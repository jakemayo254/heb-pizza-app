import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {AuthStateService} from '@src/app/services/auth-state.service';
import {AuthRequest} from '@src/app/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = null;
  password = null;
  authToken: string | null = null;
  showPassword = false;
  errorMessage = '';

  constructor(private pizzaService: PizzaService, private toast: ToastrService, private authState: AuthStateService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  requestAuthToken(): void {
    if (this.username != null && this.password != null) {
      const authRequest: AuthRequest = {
        username: this.username,
        password: this.password,
      }

      this.pizzaService.getAuthToken(authRequest).subscribe({
        next: (res) => {
          this.authToken = res.body?.access_token ?? null;
          this.authState.setAuth(this.username, this.password, res.body?.access_token ?? null);
        },
        error: (err) => {
          if (err.status === 400) {
            this.toast.error(err.error.msg, "Error");
          } else {
            this.toast.error(err.error.msg, "Unauthorized");
          }
        }
      });
    }
  }
}
