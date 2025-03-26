import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { mockOrders, MockPizzaApiService } from '@src/unit-tests/mocks/mock-pizza-api.service';
import { MockToastService } from '@src/unit-tests/mocks/mock-toast';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('OrdersStateService', (): void => {
  let service: OrdersStateService;
  let pizzaService: MockPizzaApiService;
  let toastr: MockToastService;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [
        OrdersStateService,
        { provide: PizzaApiService, useClass: MockPizzaApiService },
        { provide: ToastrService, useClass: MockToastService },
      ],
    });

    service = TestBed.inject(OrdersStateService);
    pizzaService = TestBed.inject(PizzaApiService) as unknown as MockPizzaApiService;
    toastr = TestBed.inject(ToastrService) as unknown as MockToastService;
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
