import { Injectable } from '@angular/core';
import { Order } from '@src/app/models/order.model';
import { PizzaService } from '@src/app/services/pizza.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersStateService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor(private pizzaService: PizzaService, private toast: ToastrService) {}

  getOrdersFromApi(): void {
    this.pizzaService.getOrders().subscribe({
      next: (res) => {
        this.ordersSubject.next(res.body ?? []);
      },
      error: (err) => {
        this.toast.error(err.error?.message ?? 'Unexpected error', 'Error Getting Orders');
      }
    });
  }
}
