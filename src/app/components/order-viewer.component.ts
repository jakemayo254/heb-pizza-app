import { Component } from '@angular/core';
import { PizzaApiService } from '../services/pizza-api.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {OrderFilterPipe} from '@src/app/pipes/order-filter.pipe';
import {OrdersStateService} from '@src/app/services/orders-state.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {DeleteOrderResponse} from '@src/app/models/delete-order.model';
import {ErrorResponse} from '@src/app/models/error-response.model';
import {Observable} from 'rxjs';
import {Order} from '@src/app/models/order.model';

@Component({
  selector: 'order-viewer',
  imports: [CommonModule, FormsModule, OrderFilterPipe],
  template: `
    <div id="order-viewer" data-testid="order-viewer" class="">
      <form #deleteOrderForm="ngForm" (ngSubmit)="deleteOrder()">
        <input
          required
          type="number"
          id="deleteOrder"
          name="deleteOrder"
          [(ngModel)]="deleteOrderID"
          placeholder="Enter Order ID To Delete"
        />
        <br>
        <button
          type="submit"
          [disabled]="deleteOrderForm.invalid"
          [style.cursor]="deleteOrderForm.invalid ? 'not-allowed' : 'pointer'"
        >
          Delete Order
        </button>
      </form>
      <br>
      <form #searchForm="ngForm" (ngSubmit)="clearSearchText()">
        <input
          required
          type="text"
          id="searchOrders"
          name="searchOrders"
          [(ngModel)]="searchText"
          placeholder="Search Orders..."
        />
        <br>
        <button
          type="submit"
          [disabled]="searchForm.invalid"
          [style.cursor]="searchForm.invalid ? 'not-allowed' : 'pointer'"
        >
          Clear Search
        </button>
      </form>
      <br>
      <ul>
        <li *ngFor="let order of orders$ | async | orderFilter: searchText">
          Order ID: {{ order.Order_ID }} |
          Table No: {{ order.Table_No }} |
          Crust: {{ order.Crust }} |
          Flavor: {{ order.Flavor }} |
          Size: {{ order.Size }} |
          Timestamp: {{ order.Timestamp }}
        </li>
      </ul>
      <br>
      <button type="button" style="cursor: pointer;" (click)="ordersState.getOrdersFromApi()">Refresh Orders</button>
    </div>
  `,
})
export class OrderViewerComponent {
  searchText: string | null = null;
  deleteOrderID: number | null = null;
  orders$: Observable<Order[]>;

  constructor(private pizzaService: PizzaApiService, private toast: ToastrService,
              protected ordersState: OrdersStateService) {
    this.orders$ = this.ordersState.orders$ ?? [];
  }

  deleteOrder(): void {
    if (this.deleteOrderID != null) {
      this.pizzaService.deleteOrder(this.deleteOrderID).subscribe({
        next: (result: HttpResponse<DeleteOrderResponse>) => {
          this.ordersState.getOrdersFromApi();
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
}
