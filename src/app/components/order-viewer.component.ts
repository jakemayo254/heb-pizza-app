import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { ErrorResponse } from '@src/app/models/error-response.model';
import { Order } from '@src/app/models/order.model';
import { OrderFilterPipe } from '@src/app/pipes/order-filter.pipe';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

import { PizzaApiService } from '../services/pizza-api.service';

@Component({
  selector: 'app-order-viewer',
  imports: [CommonModule, FormsModule, OrderFilterPipe],
  template: `
    <div id="order-viewer" data-testid="order-viewer" class="bg-heb-light-grey p-4">
      <!-- Search -->
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <form #searchForm="ngForm" (ngSubmit)="clearSearchText()" class="flex flex-wrap items-center gap-2">
          <input
            required
            type="text"
            id="searchOrders"
            data-testid="search-orders"
            name="searchOrders"
            [(ngModel)]="searchText"
            placeholder="Search Orders..."
            autocomplete="off"
            class="min-w-[200px] rounded border border-gray-300 bg-white px-3 py-2"
          />
          <button
            data-testid="clear-search-button"
            type="submit"
            [disabled]="searchForm.invalid"
            class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Clear Search
          </button>
        </form>
      </div>
      <!-- Orders Grid -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          *ngFor="let order of orders$ | async | orderFilter: searchText"
          class="relative rounded-lg border border-gray-200 bg-white p-4 shadow-md transition hover:shadow-lg"
        >
          <!-- Trash Button -->
          <button
            (click)="deleteOrder(order.Order_ID)"
            class="absolute top-2 right-2 text-red-600 hover:text-red-800"
            title="Delete Order"
          >
            🗑️
          </button>
          <!-- Order Info -->
          <div class="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
            <div><span class="font-semibold">Order ID:</span> {{ order.Order_ID }}</div>
            <div><span class="font-semibold">Table No:</span> {{ order.Table_No }}</div>
            <div><span class="font-semibold">Crust:</span> {{ order.Crust }}</div>
            <div><span class="font-semibold">Flavor:</span> {{ order.Flavor }}</div>
            <div><span class="font-semibold">Size:</span> {{ order.Size }}</div>
            <div>
              <span class="font-semibold">Order Time:</span>
              {{ order.Timestamp | date: 'yyyy-MM-dd hh:mm:ss a' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrderViewerComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  searchText: string | null = null;
  orders$: Observable<Order[]>;

  constructor(
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService,
    protected readonly ordersState: OrdersStateService
  ) {
    this.orders$ = this.ordersState.orders$;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.orders$.subscribe(() => {
        this.searchText = null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteOrder(orderId: number) {
    if (confirm(`Are you sure you want to delete Order ID: ${orderId}?`)) {
      this.pizzaService.deleteOrder(orderId).subscribe({
        next: (result: HttpResponse<DeleteOrderResponse>): void => {
          this.ordersState.getOrdersFromApi();
          this.toast.success(result.body?.message, 'Success');
        },
        error: (err: HttpErrorResponse): void => {
          // going to re fetch order list because maybe one of them went away so need the latest
          this.ordersState.getOrdersFromApi();
          const errorBody: ErrorResponse = err.error;
          this.toast.error(errorBody.detail, errorBody.title);
        },
      });
    }
  }

  clearSearchText(): void {
    this.searchText = null;
  }
}
