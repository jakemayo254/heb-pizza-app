import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeBodyComponent } from '@src/app/components/home-body.component';
import { OrderSubmitterComponent } from '@src/app/components/order-submitter.component';
import { OrderViewerComponent } from '@src/app/components/order-viewer.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { MockComponent } from 'ng-mocks';

describe('HomeBodyComponent', (): void => {
  let fixture: ComponentFixture<HomeBodyComponent>;

  let getRoot: () => HTMLElement | null;
  let getSubmitter: () => HTMLElement | null;
  let getViewer: () => HTMLElement | null;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [HomeBodyComponent, MockComponent(OrderSubmitterComponent), MockComponent(OrderViewerComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBodyComponent);

    getRoot = () => fixture.nativeElement.querySelector(`[data-testid="${dataTestID.appHomeBody}"]`);
    getSubmitter = () => fixture.nativeElement.querySelector('app-order-submitter');
    getViewer = () => fixture.nativeElement.querySelector('app-order-viewer');
  });

  it('should render the root container with the correct data-testid', (): void => {
    fixture.detectChanges();
    expect(getRoot()).toBeTruthy();
  });

  it('should render the order submitter and order viewer components', (): void => {
    fixture.detectChanges();
    expect(getSubmitter()).toBeTruthy();
    expect(getViewer()).toBeTruthy();
  });
});
