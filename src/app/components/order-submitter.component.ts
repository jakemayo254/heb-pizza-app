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
    <div id="order-submitter" data-testid="order-submitter" class="bg-heb-dark-red">
      <form #newOrderForm="ngForm" (ngSubmit)="submitOrder()">
        <input
          required
          type="number"
          id="tableNumber"
          name="tableNumber"
          [(ngModel)]="newOrderTableNo"
          placeholder="Table No"
        />
        <br>
        <input
          required
          type="text"
          id="size"
          name="size"
          [(ngModel)]="newOrderSize"
          placeholder="Size"
        />
        <br>
        <input
          required
          type="text"
          id="crust"
          name="crust"
          [(ngModel)]="newOrderCrust"
          placeholder="Crust"
        />
        <br>
        <input
          required
          type="text"
          id="flavor"
          name="deleteOrder"
          [(ngModel)]="newOrderFlavor"
          placeholder="Flavor"
        />
        <br>
        <button
          type="submit"
          [disabled]="newOrderForm.invalid"
          [style.cursor]="newOrderForm.invalid ? 'not-allowed' : 'pointer'"
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

  constructor(private pizzaService: PizzaApiService, private toast: ToastrService,
              protected authState: AuthStateService, protected ordersState: OrdersStateService) {
  }

  submitOrder(): void {
    if (this.authState.authToken !== null && this.authState.authToken !== '' &&
      this.newOrderFlavor !== null && this.newOrderFlavor !== '' &&
      this.newOrderCrust !== null && this.newOrderCrust !== '' &&
      this.newOrderSize !== null && this.newOrderSize !== '' &&
      this.newOrderTableNo !== null) {

      const orderRequest: OrderRequest = {
        Table_No: this.newOrderTableNo,
        Flavor: this.newOrderFlavor,
        Crust: this.newOrderCrust,
        Size: this.newOrderSize
      }

      this.pizzaService.postOrder(orderRequest, this.authState.authToken).subscribe({
        next: (): void => {
          this.ordersState.getOrdersFromApi();
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
            this.authState.resetAuthToken();
            this.toast.info("Auth Token Refreshed. Please try again.", "Success");
          }
        }
      })
    }
  }
}
