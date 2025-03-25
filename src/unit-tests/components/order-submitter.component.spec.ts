import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OrderSubmitterComponent } from '@src/app/components/order-submitter.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { PizzaOrder } from '@src/app/models/order.model';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('OrderSubmitterComponent', (): void => {
  let fixture: ComponentFixture<OrderSubmitterComponent>;
  let pizzaServiceSpy: jasmine.SpyObj<PizzaApiService>;
  let authStateSpy: jasmine.SpyObj<AuthStateService>;
  let toastSpy: jasmine.SpyObj<ToastrService>;
  let ordersStateSpy: jasmine.SpyObj<OrdersStateService>;

  beforeEach(async (): Promise<void> => {
    pizzaServiceSpy = jasmine.createSpyObj('PizzaApiService', ['postOrder']);
    authStateSpy = jasmine.createSpyObj('AuthStateService', ['getAuthToken', 'clearAuth']);
    toastSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    ordersStateSpy = jasmine.createSpyObj('OrdersStateService', ['getOrdersFromApi']);

    await TestBed.configureTestingModule({
      imports: [OrderSubmitterComponent, CommonModule, FormsModule],
      providers: [
        { provide: PizzaApiService, useValue: pizzaServiceSpy },
        { provide: AuthStateService, useValue: authStateSpy },
        { provide: ToastrService, useValue: toastSpy },
        { provide: OrdersStateService, useValue: ordersStateSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSubmitterComponent);
    fixture.detectChanges();
  });

  it('should create the component', (): void => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render all input fields and submit button', (): void => {
    expect(fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newTableNoInput}"]`)).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newCrustInput}"]`)).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newFlavorInput}"]`)).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newSizeInput}"]`)).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`[data-testid="${dataTestID.submitOrder}"]`)).toBeTruthy();
  });

  it('should disable submit button when form is invalid', async (): Promise<void> => {
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.submitOrder}"]`);
    expect(button.disabled).toBeTrue();
  });

  it('should submit order and show success toast, and return order details', (): void => {
    authStateSpy.getAuthToken.and.returnValue('mock-token');

    /* eslint-disable @typescript-eslint/naming-convention */
    const mockOrder: PizzaOrder = {
      Order_ID: 1001,
      Table_No: 5,
      Crust: 'Thin',
      Flavor: 'Pepperoni',
      Size: 'Medium',
      Timestamp: new Date('2025-03-24T12:00:00Z'),
    };

    pizzaServiceSpy.postOrder.and.returnValue(
      of(
        new HttpResponse<PizzaOrder>({
          body: mockOrder,
          status: 201,
          statusText: 'Created',
        })
      )
    );

    const tableNoInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newTableNoInput}"]`);
    const crustInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newCrustInput}"]`);
    const flavorInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newFlavorInput}"]`);
    const sizeInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newSizeInput}"]`);

    tableNoInput.value = mockOrder.Table_No;
    tableNoInput.dispatchEvent(new Event('input'));

    crustInput.value = mockOrder.Crust;
    crustInput.dispatchEvent(new Event('input'));

    flavorInput.value = mockOrder.Flavor;
    flavorInput.dispatchEvent(new Event('input'));

    sizeInput.value = mockOrder.Size;
    sizeInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    /* eslint-disable @typescript-eslint/naming-convention */
    expect(pizzaServiceSpy.postOrder).toHaveBeenCalledWith(
      {
        Table_No: mockOrder.Table_No,
        Crust: mockOrder.Crust,
        Flavor: mockOrder.Flavor,
        Size: mockOrder.Size,
      },
      'mock-token'
    );

    expect(toastSpy.success).toHaveBeenCalledWith('Order added successfully.', 'Success');
    expect(ordersStateSpy.getOrdersFromApi).toHaveBeenCalled();
  });

  it('should handle 401 unauthorized error and clear auth', (): void => {
    authStateSpy.getAuthToken.and.returnValue('expired-token');

    const mockError = new HttpErrorResponse({ status: 401 });
    pizzaServiceSpy.postOrder.and.returnValue(throwError(() => mockError));

    const tableNoInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newTableNoInput}"]`);
    const crustInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newCrustInput}"]`);
    const flavorInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newFlavorInput}"]`);
    const sizeInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newSizeInput}"]`);

    tableNoInput.value = 2;
    tableNoInput.dispatchEvent(new Event('input'));

    crustInput.value = 'Stuffed';
    crustInput.dispatchEvent(new Event('input'));

    flavorInput.value = 'Veggie';
    flavorInput.dispatchEvent(new Event('input'));

    sizeInput.value = 'Large';
    sizeInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(authStateSpy.clearAuth).toHaveBeenCalled();
    expect(toastSpy.error).toHaveBeenCalledWith('Auth Token Expired. Please log back in.', 'Error');
  });

  it('should handle other errors and show toast with msg', (): void => {
    authStateSpy.getAuthToken.and.returnValue('mock-token');

    const mockError = new HttpErrorResponse({
      status: 500,
      error: { msg: 'Something went wrong' },
    });

    pizzaServiceSpy.postOrder.and.returnValue(throwError(() => mockError));

    const tableNoInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newTableNoInput}"]`);
    const crustInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newCrustInput}"]`);
    const flavorInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newFlavorInput}"]`);
    const sizeInput = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.newSizeInput}"]`);

    tableNoInput.value = 3;
    tableNoInput.dispatchEvent(new Event('input'));

    crustInput.value = 'Cheese Burst';
    crustInput.dispatchEvent(new Event('input'));

    flavorInput.value = 'BBQ';
    flavorInput.dispatchEvent(new Event('input'));

    sizeInput.value = 'Small';
    sizeInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(toastSpy.error).toHaveBeenCalledWith('Something went wrong', 'Error Sending Order');
  });
});
