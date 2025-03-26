import { HttpResponse } from '@angular/common/http';
import { PizzaOrder } from '@src/app/models/pizza-order.model';
import { of } from 'rxjs';

/* eslint-disable @typescript-eslint/naming-convention */
export const mockOrders: PizzaOrder[] = [
  {
    Order_ID: 101,
    Table_No: 3,
    Crust: 'Thin',
    Flavor: 'Pepperoni',
    Size: 'Medium',
    Timestamp: new Date('2025-03-25T18:00:00Z'),
  },
  {
    Order_ID: 102,
    Table_No: 5,
    Crust: 'Cheese Burst',
    Flavor: 'Veggie',
    Size: 'Large',
    Timestamp: new Date('2025-03-26T14:30:00Z'),
  },
];

export class MockPizzaApiService {
  getOrders = jasmine.createSpy().and.returnValue(of(new HttpResponse({ body: mockOrders })));
}
