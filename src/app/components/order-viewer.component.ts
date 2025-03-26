import { DatePipe, NgFor } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dataTestID } from '@src/app/constants/data-test-id';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { ErrorResponse } from '@src/app/models/error-response.model';
import { PizzaOrder } from '@src/app/models/pizza-order.model';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-order-viewer',
  standalone: true,
  imports: [NgFor, FormsModule, DatePipe],
  template: `
    <div [attr.data-testid]="dataTestID.appOrderViewer" class="bg-heb-light-grey p-4">
      <!-- Search -->
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <form #searchForm="ngForm" (ngSubmit)="clearSearchText()" class="flex flex-wrap items-center gap-2">
          <input
            id="searchOrders"
            name="searchOrders"
            [attr.data-testid]="dataTestID.searchOrder"
            type="text"
            [ngModel]="searchText()"
            (ngModelChange)="searchText.set($event)"
            required
            placeholder="Search Orders..."
            autocomplete="off"
            class="min-w-[200px] rounded border border-gray-300 bg-white px-3 py-2"
          />
          <button
            type="submit"
            [attr.data-testid]="dataTestID.clearSearchOrder"
            [disabled]="searchForm.invalid"
            class="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Search
          </button>
        </form>
      </div>

      <!-- Orders Grid -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          *ngFor="let order of filteredOrders()"
          class="relative rounded-lg border border-gray-200 bg-white p-4 shadow-md transition hover:shadow-lg"
        >
          <!-- Trash Button -->
          <button
            type="button"
            [attr.data-testid]="dataTestID.deleteOrder + order.Table_No"
            (click)="deleteOrder(order.Order_ID)"
            title="Delete Order"
            style="cursor: pointer;"
            class="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
            🗑️
          </button>

          <!-- Order Info -->
          <div
            [attr.data-testid]="dataTestID.orderCard + order.Table_No"
            class="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2"
          >
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
export class OrderViewerComponent {
  protected readonly dataTestID = dataTestID;
  protected readonly searchText = signal<string | null>(null);

  get orders(): Signal<PizzaOrder[]> {
    return this.ordersState.ordersSignal;
  }

  protected readonly filteredOrders = computed((): PizzaOrder[] => {
    const search = this.searchText()?.toLowerCase()?.trim();
    const orders = this.orders();

    if (!search) return orders;

    return orders.filter(
      (order: PizzaOrder): boolean =>
        order.Flavor.toLowerCase().includes(search) ||
        order.Crust.toLowerCase().includes(search) ||
        order.Size.toLowerCase().includes(search) ||
        order.Table_No.toString().includes(search)
    );
  });

  constructor(
    private readonly ordersState: OrdersStateService,
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService
  ) {
    effect((): void => {
      this.orders();
      this.searchText.set(null);
    });
  }

  deleteOrder(orderId: number): void {
    if (confirm(`Are you sure you want to delete Order ID: ${orderId}?`)) {
      this.pizzaService
        .deleteOrder(orderId)
        .pipe(
          finalize((): void => {
            this.ordersState.getOrdersFromApi();
          })
        )
        .subscribe({
          next: (result: HttpResponse<DeleteOrderResponse>): void => {
            this.toast.success(result.body?.message, 'Success');
          },
          error: (err: HttpErrorResponse): void => {
            const errorBody: ErrorResponse = err.error;
            this.toast.error(errorBody.detail, errorBody.title);
          },
        });
    }
  }

  clearSearchText(): void {
    this.searchText.set(null);
  }
}

// grid = turns the container into a grid layout
// grid-cols-1 = 1 column layout by default (mobile-first)
// gap-4 = add space between grid items
// md:grid-cols-2 = on medium or higher change to 2 columns
