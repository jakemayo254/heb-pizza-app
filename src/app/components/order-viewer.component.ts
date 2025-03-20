import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { ErrorResponse } from '@src/app/models/error-response.model';
import { Order } from '@src/app/models/order.model';
import { OrderFilterPipe } from '@src/app/pipes/order-filter.pipe';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { PizzaApiService } from '../services/pizza-api.service';

@Component({
  selector: 'app-order-viewer',
  imports: [CommonModule, FormsModule, OrderFilterPipe],
  template: `
    <div id="order-viewer" data-testid="order-viewer" class="p-4 bg-gray-100">
      <!-- Top flex container for delete + search -->
      <div class="flex flex-wrap gap-4 mb-4 items-center">
        <!-- Delete Order Form -->
        <form #deleteOrderForm="ngForm" (ngSubmit)="deleteOrder()" class="flex gap-2 items-center flex-wrap">
          <input
            required
            type="number"
            id="deleteOrder"
            name="deleteOrder"
            [(ngModel)]="deleteOrderID"
            placeholder="Order ID"
            autocomplete="off"
            class="bg-white border border-gray-300 rounded px-3 py-2 min-w-[180px]"
          />
          <button
            type="submit"
            [disabled]="deleteOrderForm.invalid"
            [style.cursor]="deleteOrderForm.invalid ? 'not-allowed' : 'pointer'"
            class="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Delete Order
          </button>
        </form>

        <!-- Search Form -->
        <form #searchForm="ngForm" (ngSubmit)="clearSearchText()" class="flex gap-2 items-center flex-wrap">
          <input
            required
            type="text"
            id="searchOrders"
            name="searchOrders"
            [(ngModel)]="searchText"
            placeholder="Search Orders..."
            autocomplete="off"
            class="bg-white border border-gray-300 rounded px-3 py-2 min-w-[180px]"
          />
          <button
            type="submit"
            [disabled]="searchForm.invalid"
            [style.cursor]="searchForm.invalid ? 'not-allowed' : 'pointer'"
            class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Clear Search
          </button>
        </form>
      </div>

      <!-- Orders List -->
      <ul class="space-y-2">
        <li *ngFor="let order of orders$ | async | orderFilter: searchText" class="bg-white p-3 rounded shadow">
          Order ID: {{ order.Order_ID }} | Table No: {{ order.Table_No }} | Crust: {{ order.Crust }} | Flavor:
          {{ order.Flavor }} | Size: {{ order.Size }} | Timestamp: {{ order.Timestamp }}
        </li>
      </ul>
    </div>
  `,
})
export class OrderViewerComponent {
  searchText: string | null = null;
  deleteOrderID: number | null = null;
  orders$: Observable<Order[]>;

  constructor(
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService,
    protected readonly ordersState: OrdersStateService
  ) {
    this.orders$ = this.ordersState.orders$ ?? [];
  }

  deleteOrder(): void {
    if (this.deleteOrderID != null) {
      this.pizzaService.deleteOrder(this.deleteOrderID).subscribe({
        next: (result: HttpResponse<DeleteOrderResponse>): void => {
          this.ordersState.getOrdersFromApi();
          this.toast.success(result.body?.message, 'Success');
          this.deleteOrderID = null;
        },
        error: (err: HttpErrorResponse): void => {
          const errorBody: ErrorResponse = err.error;
          this.toast.error(errorBody.detail, errorBody.title);
          this.deleteOrderID = null;
        },
      });
    }
  }

  clearSearchText(): void {
    this.searchText = null;
  }
}
