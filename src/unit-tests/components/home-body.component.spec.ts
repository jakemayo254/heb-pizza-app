import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeBodyComponent } from '@src/app/components/home-body.component';
import { OrderSubmitterComponent } from '@src/app/components/order-submitter.component';
import { OrderViewerComponent } from '@src/app/components/order-viewer.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { ToastrService } from 'ngx-toastr';

describe('HomeBodyComponent', (): void => {
  let component: HomeBodyComponent;
  let fixture: ComponentFixture<HomeBodyComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [HomeBodyComponent, OrderSubmitterComponent, OrderViewerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', (): void => {
    expect(component).toBeTruthy();
  });

  it('should render container with correct data-testid', (): void => {
    const container = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.appHomeBody}"]`));
    expect(container).toBeTruthy();
  });

  it('should render OrderSubmitterComponent', (): void => {
    const submitter = fixture.debugElement.query(By.css('app-order-submitter'));
    expect(submitter).toBeTruthy();
  });

  it('should render OrderViewerComponent', (): void => {
    const viewer = fixture.debugElement.query(By.css('app-order-viewer'));
    expect(viewer).toBeTruthy();
  });
});
