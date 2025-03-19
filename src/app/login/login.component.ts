import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { AuthDetails } from '../models/auth.model';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Order} from '@src/app/models/order.model';

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
  deleteOrderID = null;
  showPassword = false;
  errorMessage = '';
  orders: Order[] = []

  newOrderTableNo: number | null = null;
  newOrderCrust = null;
  newOrderFlavor = null;
  newOrderSize = null;

  newOrder: Order | null = null;

  constructor(private authService: PizzaService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submitOrder(): void {
    if (this.newOrderTableNo != null && this.newOrderFlavor != null && this.newOrderCrust != null && this.newOrderSize != null) {
      let newOrder: Order = {
        Table_No: this.newOrderTableNo,
        Flavor: this.newOrderFlavor,
        Crust: this.newOrderCrust,
        Size: this.newOrderSize
      }

      this.authService.createOrder(newOrder, this.authToken).subscribe(res => {
        console.log("New Order Details: " + JSON.stringify(res));
        this.newOrder = res;
      })
    }
  }


  getOrders(): void {
    this.authService.getAllOrders().subscribe(orders => this.orders = orders);
  }

  deleteOrder(): void {
    if (this.deleteOrderID != null) {
      this.authService.deleteOrder(this.deleteOrderID).subscribe({
        next: result => {
          console.log("delete result: " + JSON.stringify(result));
        }
      })

      this.getOrders()
    }
  }

  onSubmit(): void {
    this.authService.getAuthToken(this.authDetails).subscribe({
      next: (res) => {
        console.log("Access Token: " + res.access_token)
        this.authToken = res.access_token;
        //localStorage.setItem('access_token', res.access_token);
        // Redirect or show success
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please try again.';
        console.error(err);
      }
    });
  }
}
