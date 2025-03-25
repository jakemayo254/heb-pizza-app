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

  const baseURL = environment.pizzaAPIAppBaseURL;
  const ordersURL = `${baseURL}/orders`;
  const authURL = `${baseURL}/auth`;

  beforeEach(() => {
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
    it('should POST to authURL and return AuthResponse', (): void => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const mockResponse: AuthResponse = { access_token: 'fake-token', msg: '' };
      const username = 'testuser';
      const password = 'testpass';

      service.getAuthToken(username, password).subscribe((res): void => {
        expect(res.body).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(authURL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(mockResponse, { status: 200, statusText: 'OK' });
    });
  });

  describe('getOrders', (): void => {
    it('should GET orders from ordersURL', (): void => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const mockOrders: PizzaOrder[] = [
        {
          Order_ID: 1,
          Table_No: 10,
          Crust: 'Thin',
          Flavor: 'Pepperoni',
          Size: 'Medium',
          Timestamp: new Date('2025-03-24T12:00:00Z'),
        },
        {
          Order_ID: 2,
          Table_No: 5,
          Crust: 'Thick',
          Flavor: 'Veggie',
          Size: 'Large',
          Timestamp: new Date('2025-03-24T13:00:00Z'),
        },
      ];

      service.getOrders().subscribe((res): void => {
        expect(res.body).toEqual(mockOrders);
      });

      const req = httpMock.expectOne(ordersURL);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders, { status: 200, statusText: 'OK' });
    });
  });

  describe('postOrder', (): void => {
    it('should POST order to ordersURL with auth header', (): void => {
      const orderRequest: PizzaOrderRequest = {
        Table_No: 7,
        Crust: 'Stuffed',
        Flavor: 'Margherita',
        Size: 'Small',
      };

      const mockOrder: PizzaOrder = {
        Order_ID: 123,
        ...orderRequest,
        Timestamp: new Date('2025-03-24T14:00:00Z'),
      };

      const token = 'test-token';

      service.postOrder(orderRequest, token).subscribe((res): void => {
        expect(res.body).toEqual(mockOrder);
      });

      const req = httpMock.expectOne(ordersURL);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('authorization')).toBe(`Bearer ${token}`);
      expect(req.request.body).toEqual(orderRequest);
      req.flush(mockOrder, { status: 201, statusText: 'Created' });
    });
  });

  describe('deleteOrder', (): void => {
    it('should DELETE order by ID from ordersURL', (): void => {
      const orderID = 456;
      const mockResponse: DeleteOrderResponse = { message: 'Order deleted successfully' };

      service.deleteOrder(orderID).subscribe((res): void => {
        expect(res.body).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${ordersURL}/${orderID}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse, { status: 200, statusText: 'OK' });
    });
  });
});
