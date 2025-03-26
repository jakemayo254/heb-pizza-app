import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from '@src/app/components/home.component';
import { HomeBodyComponent } from '@src/app/components/home-body.component';
import { HomeFooterComponent } from '@src/app/components/home-footer.component';
import { HomeHeaderComponent } from '@src/app/components/home-header.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { MockComponent } from 'ng-mocks';

describe('HomeComponent', (): void => {
  let fixture: ComponentFixture<HomeComponent>;
  let getHeader: () => HTMLElement | null;
  let getBody: () => HTMLElement | null;
  let getFooter: () => HTMLElement | null;
  let getRoot: () => HTMLElement | null;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        MockComponent(HomeHeaderComponent),
        MockComponent(HomeBodyComponent),
        MockComponent(HomeFooterComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);

    getRoot = () => fixture.nativeElement.querySelector(`[data-testid="${dataTestID.appHome}"]`);
    getHeader = () => fixture.nativeElement.querySelector('app-home-header');
    getBody = () => fixture.nativeElement.querySelector('app-home-body');
    getFooter = () => fixture.nativeElement.querySelector('app-home-footer');
  });

  it('should render the root container with the correct data-testid', (): void => {
    fixture.detectChanges();
    expect(getRoot()).toBeTruthy();
  });

  it('should render the home header, body, and footer components', (): void => {
    fixture.detectChanges();
    expect(getHeader()).toBeTruthy();
    expect(getBody()).toBeTruthy();
    expect(getFooter()).toBeTruthy();
  });
});
