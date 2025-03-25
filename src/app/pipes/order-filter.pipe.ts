import { Pipe, PipeTransform } from '@angular/core';
import { PizzaOrder } from '@src/app/models/pizza-order.model';

@Pipe({
  name: 'orderFilter',
  standalone: true,
})
export class OrderFilterPipe implements PipeTransform {
  // required method of PipeTransform
  // creates a new array after transforming it. does not modify the original array
  transform(orders: PizzaOrder[] | null, searchText: string | null): PizzaOrder[] {
    if (!orders) return [];
    if (!searchText) return orders;

    searchText = searchText.toLowerCase();

    return orders.filter(
      (order): boolean =>
        order.Flavor?.toLowerCase().includes(searchText) ||
        order.Size?.toLowerCase().includes(searchText) ||
        order.Crust?.toLowerCase().includes(searchText) ||
        order.Table_No?.toString().includes(searchText) ||
        order.Order_ID?.toString().includes(searchText)
    );
  }
}
