import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Order} from '@src/app/models/order.model';
import {ToastrService} from 'ngx-toastr';
import {ErrorResponse} from '@src/app/models/error-response.model';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {DeleteOrderResponse} from '@src/app/models/delete-order.model';
import {OrderFilterPipe} from '@src/app/pipes/order-filter.pipe';
import {AuthStateService} from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, OrderFilterPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  deleteOrderID = null;
  orders: Order[] = []
  newOrderTableNo: number | null = null;
  newOrderCrust = null;
  newOrderFlavor = null;
  newOrderSize = null;
  searchText = null;
  newOrder: Order | null = null;

  constructor(private pizzaService: PizzaService, private toast: ToastrService, private authState: AuthStateService) {}

  submitOrder(): void {
    if (this.authState.authToken != null && this.newOrderTableNo != null && this.newOrderFlavor != null && this.newOrderCrust != null && this.newOrderSize != null) {
      let newOrder: Order = {
        Table_No: this.newOrderTableNo,
        Flavor: this.newOrderFlavor,
        Crust: this.newOrderCrust,
        Size: this.newOrderSize
      }

      this.pizzaService.createOrder(newOrder, this.authState.authToken).subscribe({
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

  logOut(): void {
    this.authState.clearAuth();
  }
}
