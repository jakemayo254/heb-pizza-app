import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { AuthDetails } from '../models/auth.model';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authDetails: AuthDetails = {
    username: '',
    password: ''
  }
  authToken = '';

  showPassword = false;
  errorMessage = '';

  constructor(private authService: PizzaService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.authService.getAuthToken(this.authDetails).subscribe({
      next: (res) => {
        console.log("Access Token: " + res.access_token)
        localStorage.setItem('access_token', res.access_token);
        // Redirect or show success
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please try again.';
        console.error(err);
      }
    });
  }
}
