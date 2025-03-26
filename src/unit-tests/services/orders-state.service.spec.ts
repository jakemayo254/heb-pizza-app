import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PizzaOrder } from '@src/app/models/pizza-order.model';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('OrdersStateService', (): void => {
  let service: OrdersStateService;
  let pizzaService: jasmine.SpyObj<PizzaApiService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  /* eslint-disable @typescript-eslint/naming-convention */
  const mockOrders: PizzaOrder[] = [
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

  beforeEach((): void => {
    const pizzaServiceSpy = jasmine.createSpyObj('PizzaApiService', ['getOrders']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    pizzaServiceSpy.getOrders.and.returnValue(
      of(new HttpResponse({ body: mockOrders }))
    );

    TestBed.configureTestingModule({
      providers: [
        OrdersStateService,
        { provide: PizzaApiService, useValue: pizzaServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    service = TestBed.inject(OrdersStateService);
    pizzaService = TestBed.inject(PizzaApiService) as jasmine.SpyObj<PizzaApiService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should call pizzaService.getOrders() and update the orders signal with sorted data', (): void => {
    pizzaService.getOrders.and.returnValue(
      of(
        new HttpResponse({
          body: mockOrders,
          status: 200,
        })
      )
    );

    service.getOrdersFromApi();

    const result = service.ordersSignal();
    expect(pizzaService.getOrders).toHaveBeenCalled();
    expect(result.length).toBe(2);

    // Newest order should be first
    expect(result[0].Order_ID).toBe(102);
    expect(result[1].Order_ID).toBe(101);
  });

  it('should show an error toast when the API call fails with a message', (): void => {
    const mockError = {
      error: { message: 'API is down' },
    };

    pizzaService.getOrders.and.returnValue(throwError(() => mockError));
    service.getOrdersFromApi();
    expect(toastr.error).toHaveBeenCalledWith('API is down', 'Error Getting Orders');
  });

  it('should show a generic error toast when the API error lacks a message', (): void => {
    const mockError = {
      error: {},
    };

    pizzaService.getOrders.and.returnValue(throwError(() => mockError));
    service.getOrdersFromApi();
    expect(toastr.error).toHaveBeenCalledWith('Unexpected error', 'Error Getting Orders');
  });
});
