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
  ) {}

  getOrdersFromApi(): void {
    this.pizzaService.getOrders().subscribe({
      next: (res) => {
        this.ordersSubject.next(res.body ?? []);
      },
      error: (err) => {
        this.toast.error(err.error?.message ?? 'Unexpected error', 'Error Getting Orders');
      },
    });
  }
}
