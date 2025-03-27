import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [attr.data-testid]="dataTestID.appOrderSubmitter" class="bg-heb-dark-red p-4">
      <form [formGroup]="orderForm" (ngSubmit)="submitOrder()" class="flex flex-wrap items-center gap-4">
        <input
          id="tableNumber"
          type="number"
          formControlName="tableNumber"
          [attr.data-testid]="dataTestID.newTableNoInput"
          required
          placeholder="Table No"
          autocomplete="off"
          (keydown)="preventNonNumeric($event)"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          id="size"
          type="text"
          formControlName="size"
          [attr.data-testid]="dataTestID.newSizeInput"
          required
          placeholder="Size"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          id="crust"
          type="text"
          formControlName="crust"
          [attr.data-testid]="dataTestID.newCrustInput"
          required
          placeholder="Crust"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <input
          id="flavor"
          type="text"
          formControlName="flavor"
          [attr.data-testid]="dataTestID.newFlavorInput"
          required
          placeholder="Flavor"
          autocomplete="off"
          class="min-w-[150px] flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <button
          type="submit"
          [attr.data-testid]="dataTestID.submitOrder"
          [disabled]="orderForm.invalid || submitting()"
          [style.cursor]="orderForm.invalid || submitting() ? 'not-allowed' : 'pointer'"
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
  protected readonly submitting = signal(false);
  protected orderForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService,
    protected readonly authState: AuthStateService,
    protected readonly ordersState: OrdersStateService
  ) {
    this.orderForm = this.fb.group({
      tableNumber: [null, Validators.required],
      crust: ['', [Validators.required, this.trimValidator]],
      flavor: ['', [Validators.required, this.trimValidator]],
      size: ['', [Validators.required, this.trimValidator]],
    });
  }

  protected submitOrder(): void {
    const authToken = this.authState.authToken();
    const { flavor, crust, size, tableNumber } = this.orderForm.value;

    if (authToken && flavor && crust && size && tableNumber !== null) {
      this.submitting.set(true);

      const orderRequest: PizzaOrderRequest = {
        Table_No: tableNumber, // eslint-disable-line @typescript-eslint/naming-convention
        Flavor: flavor.trim(), // eslint-disable-line @typescript-eslint/naming-convention
        Crust: crust.trim(), // eslint-disable-line @typescript-eslint/naming-convention
        Size: size.trim(), // eslint-disable-line @typescript-eslint/naming-convention
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
            this.orderForm.reset();
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

  private trimValidator(control: import('@angular/forms').AbstractControl): Record<string, boolean> | null {
    const value = control.value as string;
    return value && value.trim().length === 0 ? { trimmed: true } : null;
  }
}

// () = event binding, [] = value binding, [()] = two way binding
// flex-wrap = allows flex items to wrap onto multiple lines if there isn't enough space on one line
// flex-1 = will grow to fill available space. it can shrink if needed. grow and shrink
// transition = enables CSS transition for a smooth effect when properties change.
