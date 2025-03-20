import { Injectable } from '@angular/core';
import {Order} from '@src/app/models/order.model';
import {PizzaService} from '@src/app/services/pizza.service';

@Injectable({ providedIn: 'root' })
export class OrdersStateService {
  orders: Order[] = [];

  constructor(private pizzaService: PizzaService) {}

  getOrdersFromApi(): void {
    this.pizzaService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.body ?? [];
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
      }
    });
  }
}
