import { Injectable, signal } from '@angular/core';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';

import { PizzaOrder } from '../models/pizza-order.model';

@Injectable({ providedIn: 'root' })
export class OrdersStateService {
  public readonly ordersSignal = signal<PizzaOrder[]>([]);

  constructor(
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService
  ) {
    // need orders list right when the home page is loaded
    this.getOrdersFromApi();
  }

  // this ultimately updates the orders$ observable that is in this class
  getOrdersFromApi(): void {
    this.pizzaService.getOrders().subscribe({
      next: (res): void => {
        const sortedOrdersByDateDescending = res.body?.sort(
          (a, b): number => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
        );
        // replacing the older order list
        this.ordersSignal.set(sortedOrdersByDateDescending ?? []);
      },
      error: (err): void => {
        this.toast.error(err.error?.message ?? 'Unexpected error', 'Error Getting Orders');
      },
    });
  }
}
