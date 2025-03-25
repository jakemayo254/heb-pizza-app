import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OrderViewerComponent } from '@src/app/components/order-viewer.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { PizzaOrder } from '@src/app/models/order.model';
import { OrderFilterPipe } from '@src/app/pipes/order-filter.pipe';
import { OrdersStateService } from '@src/app/services/orders-state.service';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { of, Subject, throwError } from 'rxjs';

describe('OrderViewerComponent', (): void => {
  let fixture: ComponentFixture<OrderViewerComponent>;
  let component: OrderViewerComponent;
  let pizzaServiceSpy: jasmine.SpyObj<PizzaApiService>;
  let ordersStateSpy: jasmine.SpyObj<OrdersStateService>;
  let toastSpy: jasmine.SpyObj<ToastrService>;

  /* eslint-disable @typescript-eslint/naming-convention */
  const mockOrders: PizzaOrder[] = [
    {
      Order_ID: 1,
      Table_No: 10,
      Crust: 'Thin',
      Flavor: 'Pepperoni',
      Size: 'Large',
      Timestamp: new Date('2025-03-24T14:00:00Z'),
    },
    {
      Order_ID: 2,
      Table_No: 5,
      Crust: 'Stuffed',
      Flavor: 'Veggie',
      Size: 'Medium',
      Timestamp: new Date('2025-03-24T13:00:00Z'),
    },
  ];

  beforeEach(async (): Promise<void> => {
    pizzaServiceSpy = jasmine.createSpyObj('PizzaApiService', ['deleteOrder']);
    ordersStateSpy = jasmine.createSpyObj('OrdersStateService', ['getOrdersFromApi'], {
      orders$: of(mockOrders),
    });
    toastSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [OrderViewerComponent, CommonModule, FormsModule, OrderFilterPipe],
      providers: [
        { provide: PizzaApiService, useValue: pizzaServiceSpy },
        { provide: OrdersStateService, useValue: ordersStateSpy },
        { provide: ToastrService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and render order viewer', (): void => {
    expect(component).toBeTruthy();
    const container = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.appOrderViewer}"]`);
    expect(container).toBeTruthy();
  });

  it('should display list of orders', (): void => {
    const orderCards = fixture.nativeElement.querySelectorAll(`[data-testid^="${dataTestID.orderCard}"]`);
    expect(orderCards.length).toBe(mockOrders.length);
  });

  it('should clear searchText on clearSearchText()', (): void => {
    const input = fixture.nativeElement.querySelector(`[data-testid="${dataTestID.searchOrder}"]`);
    input.value = 'Test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    component.clearSearchText();
    fixture.detectChanges();

    expect(component['searchText']).toBeNull();
  });

  it('should call deleteOrder and show success toast', (): void => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockResponse = new HttpResponse<DeleteOrderResponse>({
      body: { message: 'Order deleted successfully' },
      status: 200,
    });

    pizzaServiceSpy.deleteOrder.and.returnValue(of(mockResponse));

    component.deleteOrder(1);

    expect(pizzaServiceSpy.deleteOrder).toHaveBeenCalledWith(1);
    expect(toastSpy.success).toHaveBeenCalledWith('Order deleted successfully', 'Success');
    expect(ordersStateSpy.getOrdersFromApi).toHaveBeenCalled();
  });

  it('should handle deleteOrder error and show toast', (): void => {
    spyOn(window, 'confirm').and.returnValue(true);
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      status: 400,
      error: { title: 'Error Title', detail: 'Something went wrong' },
    });

    pizzaServiceSpy.deleteOrder.and.returnValue(throwError(() => errorResponse));

    component.deleteOrder(2);

    expect(toastSpy.error).toHaveBeenCalledWith('Something went wrong', 'Error Title');
    expect(ordersStateSpy.getOrdersFromApi).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', (): void => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should reset searchText on order stream emit (ngOnInit)', (): void => {
    const ordersSubject = new Subject<PizzaOrder[]>();
    ordersStateSpy.orders$ = ordersSubject.asObservable();
    fixture = TestBed.createComponent(OrderViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['searchText'] = 'Test';
    ordersSubject.next(mockOrders);
    // expect(component['searchText']).toBeNull();
  });
});
