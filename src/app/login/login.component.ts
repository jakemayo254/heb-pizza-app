import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { AuthRequest } from '../models/auth.model';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Order} from '@src/app/models/order.model';
import {ToastrService} from 'ngx-toastr';
import {ErrorResponse} from '@src/app/models/errorResponse.model';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {DeleteOrderResponse} from '@src/app/models/deleteOrder.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authRequest: AuthRequest = {
    username: '',
    password: ''
  }
  authToken: string | null = null;
  deleteOrderID = null;
  showPassword = false;
  errorMessage = '';
  orders: Order[] = []

  newOrderTableNo: number | null = null;
  newOrderCrust = null;
  newOrderFlavor = null;
  newOrderSize = null;
  searchOrderString = null;

  newOrder: Order | null = null;

  constructor(private pizzaService: PizzaService, private toast: ToastrService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submitOrder(): void {
    if (this.authToken != null && this.newOrderTableNo != null && this.newOrderFlavor != null && this.newOrderCrust != null && this.newOrderSize != null) {
      let newOrder: Order = {
        Table_No: this.newOrderTableNo,
        Flavor: this.newOrderFlavor,
        Crust: this.newOrderCrust,
        Size: this.newOrderSize
      }

      this.pizzaService.createOrder(newOrder, this.authToken).subscribe({
        next: (res: HttpResponse<Order>) => {
          console.log("Created Order");
          this.newOrder = res.body;
          this.getOrders();
          this.toast.success("Order added successfully.", "Success");

          this.newOrderTableNo = null;
          this.newOrderCrust = null;
          this.newOrderSize = null;
          this.newOrderFlavor = null;
        },
        error: (err: HttpErrorResponse) => {
          const errorBody: ErrorResponse = err.error;
          this.toast.error(errorBody.detail, errorBody.title);
          this.deleteOrderID = null;
        }
      })
    }
  }

  getOrders(): void {
    this.pizzaService.getAllOrders().subscribe({
      next: result => {
        this.orders = result.body ?? []
      }
    });
  }

  deleteOrder(): void {
    if (this.deleteOrderID != null) {
      this.pizzaService.deleteOrder(this.deleteOrderID).subscribe({
        next: (result: HttpResponse<DeleteOrderResponse>) => {
          this.getOrders();
          this.toast.success(result.body?.message, "Success");
          this.deleteOrderID = null;
        },
        error: (err: HttpErrorResponse) => {
          const errorBody: ErrorResponse = err.error;
          this.toast.error(errorBody.detail, errorBody.title);
          this.deleteOrderID = null;
        }
      })
    }
  }

  requestAuthToken(): void {
    this.pizzaService.getAuthToken(this.authRequest).subscribe({
      next: (res) => {
        this.authToken = res.body?.access_token ?? null;
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
