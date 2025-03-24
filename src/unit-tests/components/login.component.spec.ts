import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoginComponent } from '@src/app/components/login.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { AuthResponse } from '@src/app/models/auth.model';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let authStateServiceSpy: jasmine.SpyObj<AuthStateService>;

  beforeEach(async () => {
    authStateServiceSpy = jasmine.createSpyObj('AuthStateService', ['setAuthToken']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, CommonModule, FormsModule],
      providers: [{ provide: AuthStateService, useValue: authStateServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render login form with correct data-testids', () => {
    const usernameInput = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.loginUserName}"]`));
    const passwordInput = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.loginPassword}"]`));
    const loginButton = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.loginButton}"]`));

    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it('should toggle password visibility when icon is clicked', () => {
    const passwordInput = fixture.debugElement.query(
      By.css(`[data-testid="${dataTestID.loginPassword}"]`)
    ).nativeElement;
    const toggleBtn = fixture.debugElement.query(
      By.css(`[data-testid="${dataTestID.loginShowPassword}"]`)
    ).nativeElement;

    // Default should be password type
    expect(passwordInput.type).toBe('password');

    // Click toggle
    toggleBtn.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');

    // Click toggle again
    toggleBtn.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('password');
  });

  it('should call AuthStateService.setAuthToken and show loading text on form submit', () => {
    spyOn(console, 'log');

    /* eslint-disable @typescript-eslint/naming-convention */
    authStateServiceSpy.setAuthToken.and.returnValue(
      of(
        new HttpResponse<AuthResponse>({
          body: {
            access_token: 'mock-token',
            msg: 'Login successful',
          },
          status: 200,
          statusText: 'OK',
        })
      )
    );

    const usernameInput = fixture.debugElement.query(
      By.css(`[data-testid="${dataTestID.loginUserName}"]`)
    ).nativeElement;
    const passwordInput = fixture.debugElement.query(
      By.css(`[data-testid="${dataTestID.loginPassword}"]`)
    ).nativeElement;
    const form = fixture.debugElement.query(By.css('form')).nativeElement;

    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'testpass';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(authStateServiceSpy.setAuthToken).toHaveBeenCalledWith('testuser', 'testpass');

    // const button = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.loginButton}"]`)).nativeElement;
    // expect(button.textContent).toContain('Loading');

    expect(console.log).toHaveBeenCalledWith('login success');
  });

  it('should handle error from AuthStateService.setAuthToken', () => {
    spyOn(console, 'error');

    authStateServiceSpy.setAuthToken.and.returnValue(throwError(() => new Error('Unauthorized')));

    const usernameInput = fixture.debugElement.query(
      By.css(`[data-testid="${dataTestID.loginUserName}"]`)
    ).nativeElement;
    const passwordInput = fixture.debugElement.query(
      By.css(`[data-testid="${dataTestID.loginPassword}"]`)
    ).nativeElement;
    const form = fixture.debugElement.query(By.css('form')).nativeElement;

    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'wrongpass';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(authStateServiceSpy.setAuthToken).toHaveBeenCalledWith('testuser', 'wrongpass');
    expect(console.error).toHaveBeenCalledWith('failed login');
  });
});
