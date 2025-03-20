import { Injectable } from '@angular/core';
import {Order} from '@src/app/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersStateService {
  orders: Order[] = [];

  setOrders(orders: Order[]): void {
    this.orders = orders;
  }
}
