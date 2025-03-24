import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeComponent } from '@src/app/components/home.component';
import { HomeBodyComponent } from '@src/app/components/home-body.component';
import { HomeFooterComponent } from '@src/app/components/home-footer.component';
import { HomeHeaderComponent } from '@src/app/components/home-header.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { ToastrService } from 'ngx-toastr';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HomeHeaderComponent, HomeBodyComponent, HomeFooterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render container with correct data-testid', () => {
    const container = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.appHome}"]`));
    expect(container).toBeTruthy();
  });

  it('should render HomeHeaderComponent', () => {
    const header = fixture.debugElement.query(By.css('app-home-header'));
    expect(header).toBeTruthy();
  });

  it('should render HomeBodyComponent', () => {
    const body = fixture.debugElement.query(By.css('app-home-body'));
    expect(body).toBeTruthy();
  });

  it('should render HomeFooterComponent', () => {
    const footer = fixture.debugElement.query(By.css('app-home-footer'));
    expect(footer).toBeTruthy();
  });
});
