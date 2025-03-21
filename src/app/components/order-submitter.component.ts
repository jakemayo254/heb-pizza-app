import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorResponse } from '@src/app/models/error-response.model';
import { OrderRequest } from '@src/app/models/order.model';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { ToastrService } from 'ngx-toastr';

import { PizzaApiService } from '../services/pizza-api.service';

@Component({
  selector: 'app-order-submitter',
  imports: [CommonModule, FormsModule],
  template: `
    <div id="order-submitter" data-testid="order-submitter" class="bg-heb-dark-red p-4">
      <form #newOrderForm="ngForm" (ngSubmit)="submitOrder()" class="flex flex-wrap items-center gap-4">
        <input
          required
          type="number"
          id="tableNumber"
          data-testid="order-input-table-number"
          name="tableNumber"
          [(ngModel)]="newOrderTableNo"
          placeholder="Table No"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          required
          type="text"
          id="size"
          data-testid="order-input-size"
          name="size"
          [(ngModel)]="newOrderSize"
          placeholder="Size"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          required
          type="text"
          id="crust"
          data-testid="order-crust"
          name="crust"
          [(ngModel)]="newOrderCrust"
          placeholder="Crust"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          required
          type="text"
          id="flavor"
          data-testid="order-flavor"
          name="flavor"
          [(ngModel)]="newOrderFlavor"
          placeholder="Flavor"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <button
          type="submit"
          data-testid="order-submit-button"
          [disabled]="newOrderForm.invalid"
          [style.cursor]="newOrderForm.invalid ? 'not-allowed' : 'pointer'"
          class="rounded border border-gray-300 bg-white px-4 py-2 font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50"
        >
          Submit Order
        </button>
      </form>
    </div>
  `,
})
export class OrderSubmitterComponent {
  newOrderTableNo: number | null = null;
  newOrderCrust: string | null = null;
  newOrderFlavor: string | null = null;
  newOrderSize: string | null = null;

  constructor(
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService,
    protected readonly authState: AuthStateService,
    protected readonly ordersState: OrdersStateService
  ) {}

  submitOrder(): void {
    if (
      this.authState.authToken !== null &&
      this.authState.authToken !== '' &&
      this.newOrderFlavor !== null &&
      this.newOrderFlavor !== '' &&
      this.newOrderCrust !== null &&
      this.newOrderCrust !== '' &&
      this.newOrderSize !== null &&
      this.newOrderSize !== '' &&
      this.newOrderTableNo !== null
    ) {
      const orderRequest: OrderRequest = {
        Table_No: this.newOrderTableNo, // eslint-disable-line @typescript-eslint/naming-convention
        Flavor: this.newOrderFlavor, // eslint-disable-line @typescript-eslint/naming-convention
        Crust: this.newOrderCrust, // eslint-disable-line @typescript-eslint/naming-convention
        Size: this.newOrderSize, // eslint-disable-line @typescript-eslint/naming-convention
      };

      this.pizzaService.postOrder(orderRequest, this.authState.authToken).subscribe({
        next: (): void => {
          this.ordersState.getOrdersFromApi();
          this.toast.success('Order added successfully.', 'Success');

          this.newOrderTableNo = null;
          this.newOrderCrust = null;
          this.newOrderSize = null;
          this.newOrderFlavor = null;
        },
        error: (err: HttpErrorResponse) => {
          // re fetch list just in case there is a mismatch
          this.ordersState.getOrdersFromApi();
          const errorBody: ErrorResponse = err.error;
          this.toast.error(errorBody.detail, errorBody.title);

          console.log('errorStatus: ' + err.error.status);

          // TODO: This is broken. need to fix
          // Token expires after 15 minutes so getting a new token
          if (errorBody.status === 401) {
            console.log('Token has expired');
            this.authState.resetAuthToken();
            this.toast.info('Auth Token Refreshed. Please try again.', 'Success');
          }
        },
      });
    }
  }
}
