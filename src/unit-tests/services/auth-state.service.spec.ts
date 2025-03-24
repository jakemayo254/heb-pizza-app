import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthResponse } from '@src/app/models/auth.model';
import { AuthStateService } from '@src/app/services/auth-state.service';
import { PizzaApiService } from '@src/app/services/pizza-api.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('AuthStateService', (): void => {
  let service: AuthStateService;
  let pizzaApiServiceSpy: jasmine.SpyObj<PizzaApiService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach((): void => {
    const pizzaApiSpy = jasmine.createSpyObj('PizzaApiService', ['getAuthToken']);
    const toastSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: PizzaApiService, useValue: pizzaApiSpy },
        { provide: ToastrService, useValue: toastSpy },
      ],
    });

    service = TestBed.inject(AuthStateService);
    pizzaApiServiceSpy = TestBed.inject(PizzaApiService) as jasmine.SpyObj<PizzaApiService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    localStorage.clear();
  });

  afterEach((): void => {
    localStorage.clear();
  });

  describe('setAuthToken', (): void => {
    it('should show toast and throw error if username or password is missing', (done): void => {
      service.setAuthToken('', '').subscribe({
        error: (err): void => {
          expect(toastrServiceSpy.error).toHaveBeenCalledWith('Username and password are required', 'Error');
          expect(err.message).toBe('Missing credentials');
          done();
        },
      });
    });

    it('should store token and username in localStorage on success', (done): void => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const mockResponse = new HttpResponse<AuthResponse>({
        body: { access_token: 'test-token', msg: 'Success' },
        status: 200,
      });

      pizzaApiServiceSpy.getAuthToken.and.returnValue(of(mockResponse));

      service.setAuthToken('testuser', 'testpass').subscribe((): void => {
        expect(localStorage.getItem('authToken')).toBe('test-token');
        expect(localStorage.getItem('authUsername')).toBe('testuser');
        done();
      });
    });

    it('should log warning if access_token is missing', (done): void => {
      spyOn(console, 'warn');
      const mockResponse = new HttpResponse<AuthResponse>({
        body: { access_token: '', msg: 'Success' },
        status: 200,
      });

      pizzaApiServiceSpy.getAuthToken.and.returnValue(of(mockResponse));

      service.setAuthToken('testuser', 'testpass').subscribe((): void => {
        expect(console.warn).toHaveBeenCalledWith('Auth token missing in response body');
        done();
      });
    });

    it('should show toast and rethrow error on API failure', (done): void => {
      const apiError = {
        status: 401,
        error: { msg: 'Invalid credentials' },
      };

      pizzaApiServiceSpy.getAuthToken.and.returnValue(throwError(() => apiError));
      spyOn(console, 'error');

      service.setAuthToken('testuser', 'wrongpass').subscribe({
        error: (err) => {
          expect(toastrServiceSpy.error).toHaveBeenCalledWith('Invalid credentials', 'Unauthorized');
          expect(console.error).toHaveBeenCalledWith('Auth error:', apiError);
          expect(err).toBe(apiError);
          done();
        },
      });
    });

    it('should show toast with default message if error has no msg', (done): void => {
      const apiError = {
        status: 400,
        error: {},
      };

      pizzaApiServiceSpy.getAuthToken.and.returnValue(throwError(() => apiError));

      service.setAuthToken('testuser', 'wrongpass').subscribe({
        error: (): void => {
          expect(toastrServiceSpy.error).toHaveBeenCalledWith('Unknown error', 'Error');
          done();
        },
      });
    });
  });

  describe('getUserName', (): void => {
    it('should return the username from localStorage', (): void => {
      localStorage.setItem('authUsername', 'testuser');
      expect(service.getUserName()).toBe('testuser');
    });
  });

  describe('getAuthToken', (): void => {
    it('should return the token from localStorage', (): void => {
      localStorage.setItem('authToken', 'test-token');
      expect(service.getAuthToken()).toBe('test-token');
    });
  });

  describe('clearAuth', (): void => {
    it('should remove auth data from localStorage', (): void => {
      localStorage.setItem('authToken', 'abc');
      localStorage.setItem('authUsername', 'user');
      service.clearAuth();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('authUsername')).toBeNull();
    });
  });

  describe('isAuthenticated', (): void => {
    it('should return true if token is valid', (): void => {
      localStorage.setItem('authToken', 'valid');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if token is null/empty/invalid', (): void => {
      localStorage.setItem('authToken', '');
      expect(service.isAuthenticated()).toBeFalse();

      localStorage.setItem('authToken', 'null');
      expect(service.isAuthenticated()).toBeFalse();

      localStorage.removeItem('authToken');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });
});
