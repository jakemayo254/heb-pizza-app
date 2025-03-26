import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dataTestID } from '@src/app/constants/data-test-id';
import { PizzaOrderRequest } from '@src/app/models/pizza-order.model';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

import { PizzaApiService } from '../services/pizza-api.service';

@Component({
  selector: 'app-order-submitter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [attr.data-testid]="dataTestID.appOrderSubmitter" class="bg-heb-dark-red p-4">
      <form #newOrderForm="ngForm" (ngSubmit)="submitOrder()" class="flex flex-wrap items-center gap-4">
        <input
          id="tableNumber"
          name="tableNumber"
          [attr.data-testid]="dataTestID.newTableNoInput"
          type="number"
          [ngModel]="newOrderTableNo()"
          (ngModelChange)="newOrderTableNo.set($event)"
          required
          placeholder="Table No"
          autocomplete="off"
          (keydown)="preventNonNumeric($event)"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          id="size"
          name="size"
          [attr.data-testid]="dataTestID.newSizeInput"
          type="text"
          [ngModel]="newOrderSize()"
          (ngModelChange)="newOrderSize.set($event)"
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
          [ngModel]="newOrderCrust()"
          (ngModelChange)="newOrderCrust.set($event)"
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
          [ngModel]="newOrderFlavor()"
          (ngModelChange)="newOrderFlavor.set($event)"
          required
          placeholder="Flavor"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <button
          type="submit"
          [attr.data-testid]="dataTestID.submitOrder"
          [disabled]="isDisabled()"
          [style.cursor]="isDisabled() ? 'not-allowed' : 'pointer'"
          class="w-36 rounded border border-gray-300 bg-white px-4 py-2 font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50"
        >
          {{ submitting() ? 'Submitting...' : 'Submit Order' }}
        </button>
      </form>
    </div>
  `,
})
export class OrderSubmitterComponent {
  protected readonly dataTestID = dataTestID;
  protected readonly newOrderTableNo = signal<number | null>(null);
  protected readonly newOrderCrust = signal<string | null>(null);
  protected readonly newOrderFlavor = signal<string | null>(null);
  protected readonly newOrderSize = signal<string | null>(null);
  protected readonly submitting = signal(false);

  protected isDisabled = computed(
    (): boolean =>
      this.submitting() ||
      !this.newOrderFlavor() ||
      !this.newOrderCrust() ||
      !this.newOrderSize() ||
      this.newOrderTableNo() === null
  );

  constructor(
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService,
    protected readonly authState: AuthStateService,
    protected readonly ordersState: OrdersStateService
  ) {}

  protected submitOrder(): void {
    const authToken = this.authState.authToken();

    if (
      authToken &&
      this.newOrderFlavor() &&
      this.newOrderCrust() &&
      this.newOrderSize() &&
      this.newOrderTableNo() !== null
    ) {
      this.submitting.set(true);

      const orderRequest: PizzaOrderRequest = {
        Table_No: this.newOrderTableNo()!, // eslint-disable-line @typescript-eslint/naming-convention
        Flavor: this.newOrderFlavor()!, // eslint-disable-line @typescript-eslint/naming-convention
        Crust: this.newOrderCrust()!, // eslint-disable-line @typescript-eslint/naming-convention
        Size: this.newOrderSize()!, // eslint-disable-line @typescript-eslint/naming-convention
      };

      this.pizzaService
        .postOrder(orderRequest, authToken)
        .pipe(
          finalize((): void => {
            // because the api is very fast I opted to call the endpoint after every modification to the list
            this.ordersState.getOrdersFromApi();
            this.submitting.set(false);
          })
        )
        .subscribe({
          next: (): void => {
            this.toast.success('Order added successfully.', 'Success');
            this.newOrderTableNo.set(null);
            this.newOrderCrust.set(null);
            this.newOrderSize.set(null);
            this.newOrderFlavor.set(null);
          },
          error: (err: HttpErrorResponse): void => {
            if (err.status === 401) {
              this.authState.clearAuth();
              this.toast.error('Auth Token Expired. Please log back in.', 'Error');
            } else {
              this.toast.error(err.error?.msg ?? 'Unknown error', 'Error Sending Order');
            }
          },
        });
    }
  }

  // For Firefox and Safari Browsers allowing characters in the input field
  protected preventNonNumeric(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (
      // Allow digits
      allowedKeys.includes(event.key) ||
      (event.key >= '0' && event.key <= '9')
    ) {
      return;
    } else {
      event.preventDefault();
    }
  }
}

// flex-wrap = allows flex items to wrap onto multiple lines if there isn't enough space on one line
// flex-1 = will grow to fill available space. it can shrink if needed. grow and shrink
// transition = enables CSS transition for a smooth effect when properties change.
