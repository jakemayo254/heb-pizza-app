import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthResponse } from '@src/app/models/auth.model';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { PizzaOrder, PizzaOrderRequest } from '@src/app/models/pizza-order.model';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { environment } from '@src/environments/environment';

describe('PizzaApiService', (): void => {
  let service: PizzaApiService;
  let httpMock: HttpTestingController;

  /* eslint-disable @typescript-eslint/naming-convention */
  const mockAuthResponse: AuthResponse = {
    access_token: 'test-access-token',
    msg: 'Login successful',
  };

  const mockOrders: PizzaOrder[] = [
    {
      Table_No: 10,
      Crust: 'Cheese Burst',
      Flavor: 'Veggie',
      Size: 'Large',
      Order_ID: 1,
      Timestamp: new Date('2025-03-25T10:00:00Z'),
    },
  ];

  const mockOrderRequest: PizzaOrderRequest = {
    Table_No: 12,
    Crust: 'Thin',
    Flavor: 'Pepperoni',
    Size: 'Medium',
  };

  const mockPostedOrder: PizzaOrder = {
    ...mockOrderRequest,
    Order_ID: 2,
    Timestamp: new Date('2025-03-26T12:00:00Z'),
  };

  const mockDeleteResponse: DeleteOrderResponse = { message: 'deleted' };

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [PizzaApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PizzaApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach((): void => {
    httpMock.verify();
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('getAuthToken', (): void => {
    it('should POST credentials and return auth response', (): void => {
      service.getAuthToken('user', 'pass').subscribe((res): void => {
        expect(res.body).toEqual(mockAuthResponse);
        expect(res.body?.access_token).toBe('test-access-token');
        expect(res.body?.msg).toBe('Login successful');
      });

      const req = httpMock.expectOne(`${environment.pizzaAPIAppBaseURL}/auth`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'user', password: 'pass' });

      req.flush(mockAuthResponse, { status: 200, statusText: 'OK' });
    });
  });

  describe('getOrders', () => {
    it('should GET and return list of pizza orders', () => {
      service.getOrders().subscribe((res) => {
        expect(res.body).toEqual(mockOrders);
      });

      const req = httpMock.expectOne(`${environment.pizzaAPIAppBaseURL}/orders`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders, { status: 200, statusText: 'OK' });
    });
  });

  describe('postOrder', () => {
    it('should POST a pizza order with auth header and return response', () => {
      const token = 'abc123';

      service.postOrder(mockOrderRequest, token).subscribe((res) => {
        expect(res.body).toEqual(mockPostedOrder);
      });

      const req = httpMock.expectOne(`${environment.pizzaAPIAppBaseURL}/orders`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('authorization')).toBe(`Bearer ${token}`);
      expect(req.request.body).toEqual(mockOrderRequest);
      req.flush(mockPostedOrder, { status: 201, statusText: 'Created' });
    });
  });

  describe('deleteOrder', () => {
    it('should DELETE an order and return response', () => {
      const orderId = 123;

      service.deleteOrder(orderId).subscribe((res) => {
        expect(res.body).toEqual(mockDeleteResponse);
      });

      const req = httpMock.expectOne(`${environment.pizzaAPIAppBaseURL}/orders/${orderId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockDeleteResponse, { status: 200, statusText: 'OK' });
    });
  });
});
