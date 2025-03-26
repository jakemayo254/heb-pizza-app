import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/components/home.component';
import { LoginComponent } from '@src/app/components/login.component';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { AuthStateServiceMock } from '@src/unit-tests/services/auth-state.service.mock';
import { MockComponent } from 'ng-mocks';

describe('AppComponent', (): void => {
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthStateServiceMock;

  let getLogin: () => HTMLElement | null;
  let getHome: () => HTMLElement | null;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MockComponent(LoginComponent), MockComponent(HomeComponent)],
      providers: [{ provide: AuthStateService, useClass: AuthStateServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    authService = TestBed.inject(AuthStateService) as never;

    getLogin = () => fixture.nativeElement.querySelector('app-login');
    getHome = () => fixture.nativeElement.querySelector('app-home');
  });

  it('should show login if not authenticated', (): void => {
    authService.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();

    expect(getLogin()).toBeTruthy();
    expect(getHome()).toBeFalsy();
  });

  it('should show home if authenticated', (): void => {
    authService.isAuthenticated.and.returnValue(true);
    fixture.detectChanges();

    expect(getLogin()).toBeFalsy();
    expect(getHome()).toBeTruthy();
  });
});
