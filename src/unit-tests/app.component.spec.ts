import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/components/home.component';
import { LoginComponent } from '@src/app/components/login.component';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { ToastrService } from 'ngx-toastr';

describe('AppComponent', (): void => {
  let fixture: ComponentFixture<AppComponent>;
  let authStateServiceSpy = jasmine.createSpyObj('AuthStateService', [
    'isAuthenticated',
    'getUserName',
    'getAuthToken',
    'clearAuth',
    'setAuthToken',
  ]);
  let toastSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async (): Promise<void> => {
    authStateServiceSpy = jasmine.createSpyObj('AuthStateService', [
      'isAuthenticated',
      'getUserName',
      'getAuthToken',
      'clearAuth',
      'setAuthToken',
    ]);
    toastSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, CommonModule, LoginComponent, HomeComponent],
      providers: [
        { provide: AuthStateService, useValue: authStateServiceSpy },
        { provide: ToastrService, useValue: toastSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the component', (): void => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should show login component when not authenticated', (): void => {
    authStateServiceSpy.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();

    const loginComponent = fixture.debugElement.query(By.css('app-login'));
    const homeComponent = fixture.debugElement.query(By.css('app-home'));

    expect(loginComponent).toBeTruthy();
    expect(homeComponent).toBeFalsy();
  });

  it('should show home component when authenticated', (): void => {
    authStateServiceSpy.getUserName.and.returnValue('TestUser');
    authStateServiceSpy.isAuthenticated.and.returnValue(true);
    fixture.detectChanges();

    const homeComponent = fixture.debugElement.query(By.css('app-home'));
    const loginComponent = fixture.debugElement.query(By.css('app-login'));

    expect(homeComponent).toBeTruthy();
    expect(loginComponent).toBeFalsy();
  });
});
