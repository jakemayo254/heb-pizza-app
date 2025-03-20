import { Component } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
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
  templateUrl: './order-viewer.component.html',
})
export class OrderViewerComponent {
  searchText: string | null = null;
  deleteOrderID: number | null = null;
  orders$: Observable<Order[]>;

  constructor(private pizzaService: PizzaService, private toast: ToastrService,
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
