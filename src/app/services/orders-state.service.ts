import { Injectable } from '@angular/core';
import { Order } from '@src/app/models/order.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersStateService {
  private readonly ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor(
    private readonly pizzaService: PizzaApiService,
    private readonly toast: ToastrService
  ) {
    // need orders list right when the home page is loaded
    this.getOrdersFromApi();
  }

  getOrdersFromApi(): void {
    this.pizzaService.getOrders().subscribe({
      next: (res): void => {
        const sortedOrdersByDate = res.body?.sort(
          (a, b): number => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
        );
        this.ordersSubject.next(sortedOrdersByDate ?? []);
      },
      error: (err): void => {
        this.toast.error(err.error?.message ?? 'Unexpected error', 'Error Getting Orders');
      },
    });
  }
}
