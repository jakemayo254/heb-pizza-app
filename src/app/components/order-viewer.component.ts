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
    <div id="order-viewer" data-testid="order-viewer" class="bg-gray-100 p-4">
      <!-- Top flex container for delete + search -->
      <div class="mb-6 flex flex-wrap items-center gap-4">
        <!-- Delete Order Form -->
        <form #deleteOrderForm="ngForm" (ngSubmit)="deleteOrder()" class="flex flex-wrap items-center gap-2">
          <input
            required
            type="number"
            id="deleteOrder"
            name="deleteOrder"
            [(ngModel)]="deleteOrderID"
            placeholder="Order ID"
            autocomplete="off"
            class="min-w-[180px] rounded border border-gray-300 bg-white px-3 py-2"
          />
          <button
            type="submit"
            [disabled]="deleteOrderForm.invalid"
            [style.cursor]="deleteOrderForm.invalid ? 'not-allowed' : 'pointer'"
            class="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Delete Order
          </button>
        </form>

        <!-- Search Form -->
        <form #searchForm="ngForm" (ngSubmit)="clearSearchText()" class="flex flex-wrap items-center gap-2">
          <input
            required
            type="text"
            id="searchOrders"
            name="searchOrders"
            [(ngModel)]="searchText"
            placeholder="Search Orders..."
            autocomplete="off"
            class="min-w-[180px] rounded border border-gray-300 bg-white px-3 py-2"
          />
          <button
            type="submit"
            [disabled]="searchForm.invalid"
            [style.cursor]="searchForm.invalid ? 'not-allowed' : 'pointer'"
            class="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Clear Search
          </button>
        </form>
      </div>

      <!-- Orders List -->
      <ul class="space-y-3">
        <li
          *ngFor="let order of orders$ | async | orderFilter: searchText"
          class="rounded-lg border border-gray-200 bg-white p-4 shadow"
        >
          <div class="grid gap-2 text-sm md:grid-cols-2">
            <div><span class="font-semibold text-gray-700">Order ID:</span> {{ order.Order_ID }}</div>
            <div><span class="font-semibold text-gray-700">Table No:</span> {{ order.Table_No }}</div>
            <div><span class="font-semibold text-gray-700">Crust:</span> {{ order.Crust }}</div>
            <div><span class="font-semibold text-gray-700">Flavor:</span> {{ order.Flavor }}</div>
            <div><span class="font-semibold text-gray-700">Size:</span> {{ order.Size }}</div>
            <div>
              <span class="font-semibold text-gray-700">Order Time:</span>
              {{ order.Timestamp | date: 'yyyy-MM-dd hh:mm:ss a' }}
            </div>
          </div>
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
