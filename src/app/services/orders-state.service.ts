import { Injectable } from '@angular/core';
import { PizzaOrder } from '@src/app/models/pizza-order.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersStateService {
  // BehaviorSubject = a RxJS type that holds a current value and lets you emit new values over time
  private readonly ordersSubject = new BehaviorSubject<PizzaOrder[]>([]);
  // $ = naming convention letting use know that it is an observable variable
  // asObservable() = hides the ability to call .next() on it
  // on this class can push updates.  anything outside the class can only react to the updates
  public orders$: Observable<PizzaOrder[]> = this.ordersSubject.asObservable();

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
        const sortedOrdersByDateDescending = res.body?.sort(
          (a, b): number => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
        );
        // replacing the older order list
        this.ordersSubject.next(sortedOrdersByDateDescending ?? []);
      },
      error: (err): void => {
        this.toast.error(err.error?.message ?? 'Unexpected error', 'Error Getting Orders');
      },
    });
  }
}
