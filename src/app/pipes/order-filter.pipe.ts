import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '@src/app/models/order.model';

@Pipe({
  name: 'orderFilter',
  standalone: true
})
export class OrderFilterPipe implements PipeTransform {
  transform(orders: Order[], searchText: string | null): Order[] {
    if (!orders || !searchText) return orders;

    searchText = searchText.toLowerCase();

    return orders.filter(order =>
      order.Flavor?.toLowerCase().includes(searchText) ||
      order.Size?.toLowerCase().includes(searchText) ||
      order.Crust?.toLowerCase().includes(searchText) ||
      order.Table_No?.toString().includes(searchText) ||
      order.Order_ID?.toString().includes(searchText)
    );
  }
}
