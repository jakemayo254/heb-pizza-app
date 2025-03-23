import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dataTestID } from '@src/app/constants/data-test-id';
import { OrderRequest } from '@src/app/models/order.model';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { ToastrService } from 'ngx-toastr';

import { PizzaApiService } from '../services/pizza-api.service';

@Component({
  selector: 'app-order-submitter',
  imports: [CommonModule, FormsModule],
  template: `
    <div [attr.data-testid]="dataTestID.appOrderSubmitter" class="bg-heb-dark-red p-4">
      <form #newOrderForm="ngForm" (ngSubmit)="submitOrder()" class="flex flex-wrap items-center gap-4">
        <input
          id="tableNumber"
          name="tableNumber"
          [attr.data-testid]="dataTestID.newTableNoInput"
          type="number"
          [(ngModel)]="newOrderTableNo"
          required
          placeholder="Table No"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          id="size"
          name="size"
          [attr.data-testid]="dataTestID.newSizeInput"
          type="text"
          [(ngModel)]="newOrderSize"
          required
          placeholder="Size"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          id="crust"
          name="crust"
          [attr.data-testid]="dataTestID.newCrustInput"
          type="text"
          [(ngModel)]="newOrderCrust"
          required
          placeholder="Crust"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          id="flavor"
          name="flavor"
          [attr.data-testid]="dataTestID.newFlavorInput"
          type="text"
          [(ngModel)]="newOrderFlavor"
          required
          placeholder="Flavor"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <button
          type="submit"
          [attr.data-testid]="dataTestID.submitOrder"
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
  protected readonly dataTestID = dataTestID;
  protected newOrderTableNo: number | null = null;
  protected newOrderCrust: string | null = null;
  protected newOrderFlavor: string | null = null;
  protected newOrderSize: string | null = null;

  constructor(
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService,
    protected readonly authState: AuthStateService,
    protected readonly ordersState: OrdersStateService
  ) {}

  submitOrder(): void {
    if (
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

      this.pizzaService.postOrder(orderRequest, this.authState.getAuthToken() ?? '').subscribe({
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

          if (err.status === 401) {
            console.log('Token has expired');
            this.authState.clearAuth();
            this.toast.error('Auth Token Expired. Please log back in.', 'Error');
          } else {
            this.toast.error(err.error.msg, 'Error Sending Order');
          }
        },
      });
    }
  }
}
