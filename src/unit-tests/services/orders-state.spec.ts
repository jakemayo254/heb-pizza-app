import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Order } from '@src/app/models/order.model';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { of, take, throwError } from 'rxjs';

describe('OrdersStateService', (): void => {
  let service: OrdersStateService;
  let pizzaApiServiceSpy: jasmine.SpyObj<PizzaApiService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach((): void => {
    const pizzaSpy = jasmine.createSpyObj('PizzaApiService', ['getOrders']);
    const toastSpy = jasmine.createSpyObj('ToastrService', ['error']);

    pizzaSpy.getOrders.and.returnValue(of(new HttpResponse({ body: [] })));

    TestBed.configureTestingModule({
      providers: [
        OrdersStateService,
        { provide: PizzaApiService, useValue: pizzaSpy },
        { provide: ToastrService, useValue: toastSpy },
      ],
    });

    service = TestBed.inject(OrdersStateService);
    pizzaApiServiceSpy = TestBed.inject(PizzaApiService) as jasmine.SpyObj<PizzaApiService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('getOrdersFromApi', (): void => {
    it('should call pizzaService.getOrders() and emit sorted orders by descending Timestamp', (done): void => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const mockOrders: Order[] = [
        {
          Order_ID: 1,
          Table_No: 10,
          Crust: 'Thin',
          Flavor: 'Pepperoni',
          Size: 'Medium',
          Timestamp: new Date('2024-03-23T12:00:00Z'),
        },
        {
          Order_ID: 2,
          Table_No: 5,
          Crust: 'Thick',
          Flavor: 'Veggie',
          Size: 'Large',
          Timestamp: new Date('2024-03-24T15:00:00Z'),
        },
      ];

      const expectedSorted = [mockOrders[1], mockOrders[0]];

      pizzaApiServiceSpy.getOrders.and.returnValue(of(new HttpResponse({ body: mockOrders, status: 200 })));

      // ✅ Wait for second emission (after getOrdersFromApi emits sorted orders)
      service.orders$.pipe(take(2)).subscribe((orders): void => {
        // Ignore first emission [] from BehaviorSubject, assert second one
        if (orders.length > 0) {
          expect(orders).toEqual(expectedSorted);
          done();
        }
      });

      // Manually trigger API call (if not already done in constructor)
      service.getOrdersFromApi();
    });

    // it('should emit empty array if response body is null or undefined', (done) => {
    //   pizzaApiServiceSpy.getOrders.and.returnValue(of(new HttpResponse([])));
    //
    //   service.orders$.subscribe((orders) => {
    //     expect(orders).toEqual([]);
    //     done();
    //   });
    //
    //   service.getOrdersFromApi();
    // });

    it('should show toast error on API failure', (): void => {
      const errorResponse = {
        status: 500,
        error: { message: 'Server error' },
      };

      pizzaApiServiceSpy.getOrders.and.returnValue(throwError(() => errorResponse));

      service.getOrdersFromApi();

      expect(toastrServiceSpy.error).toHaveBeenCalledWith('Server error', 'Error Getting Orders');
    });

    it('should show default error message if error response has no message', (): void => {
      const errorResponse = {
        status: 500,
        error: {},
      };

      pizzaApiServiceSpy.getOrders.and.returnValue(throwError(() => errorResponse));

      service.getOrdersFromApi();

      expect(toastrServiceSpy.error).toHaveBeenCalledWith('Unexpected error', 'Error Getting Orders');
    });
  });
});
