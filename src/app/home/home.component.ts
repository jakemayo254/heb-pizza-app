import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Order, OrderRequest} from '@src/app/models/order.model';
import {ToastrService} from 'ngx-toastr';
import {ErrorResponse} from '@src/app/models/error-response.model';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {DeleteOrderResponse} from '@src/app/models/delete-order.model';
import {OrderFilterPipe} from '@src/app/pipes/order-filter.pipe';
import {AuthStateService} from '@src/app/services/auth-state.service';
import {fetchAuthTokenAgain} from '@src/app/utils/auth-token-fetcher';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, OrderFilterPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  orders: Order[] = []
  deleteOrderID: number | null = null;
  newOrderTableNo: number | null = null;
  newOrderCrust: string | null = null;
  newOrderFlavor: string | null = null;
  newOrderSize: string | null = null;
  searchText: string | null = null;

  constructor(private pizzaService: PizzaService, private toast: ToastrService, protected authState: AuthStateService) {
    this.getOrders();
  }

  submitOrder(): void {
    if (this.authState.authToken !== null && this.authState.authToken !== '' &&
      this.newOrderFlavor !== null && this.newOrderFlavor !== '' &&
      this.newOrderCrust !== null && this.newOrderCrust !== '' &&
      this.newOrderSize !== null && this.newOrderSize !== '' &&
      this.newOrderTableNo !== null) {

      let orderRequest: OrderRequest = {
        Table_No: this.newOrderTableNo,
        Flavor: this.newOrderFlavor,
        Crust: this.newOrderCrust,
        Size: this.newOrderSize
      }

      this.pizzaService.createOrder(orderRequest, this.authState.authToken).subscribe({
        next: (res: HttpResponse<Order>) => {
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

          // Token expires after 15 minutes so getting a new token
          if (errorBody.status === 401) {
            fetchAuthTokenAgain(this.pizzaService, this.authState, this.toast);
            this.toast.info("Auth Token Refreshed. Please try again.", "Success");
          }
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

  clearSearchText(): void {
    this.searchText = null;
  }

  logOut(): void {
    this.authState.clearAuth();
  }
}
