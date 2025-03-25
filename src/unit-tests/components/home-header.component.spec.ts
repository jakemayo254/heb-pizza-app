import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeHeaderComponent } from '@src/app/components/home-header.component';
import { dataTestID } from '@src/app/constants/data-test-id';
import { AuthStateService } from '@src/app/services/auth-state.service';

describe('HomeHeaderComponent', (): void => {
  let component: HomeHeaderComponent;
  let fixture: ComponentFixture<HomeHeaderComponent>;
  let mockAuthStateService: jasmine.SpyObj<AuthStateService>;

  beforeEach(async (): Promise<void> => {
    mockAuthStateService = jasmine.createSpyObj('AuthStateService', ['clearAuth', 'getUserName']);
    mockAuthStateService.getUserName.and.returnValue('Test User');

    await TestBed.configureTestingModule({
      imports: [HomeHeaderComponent], // ✅ Use `imports` for standalone components
      providers: [{ provide: AuthStateService, useValue: mockAuthStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render logo and welcome message', (): void => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img')?.getAttribute('src')).toContain('heb-logo.png');
    expect(compiled.textContent).toContain('Welcome, Test User');
  });

  it('should call clearAuth on desktop logout click', (): void => {
    const logoutButton = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.logoutButton}"]`));
    logoutButton.triggerEventHandler('click');
    expect(mockAuthStateService.clearAuth).toHaveBeenCalled();
  });

  it('should call clearAuth on mobile logout click', (): void => {
    const mobileLogoutButton = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.mobileLogoutButton}"]`));
    mobileLogoutButton.triggerEventHandler('click');
    expect(mockAuthStateService.clearAuth).toHaveBeenCalled();
  });

  it('should close mobile dropdown on ngAfterViewInit', (): void => {
    const mobileDropdown = component.mobileDropdownRef.nativeElement;
    spyOn(mobileDropdown, 'removeAttribute');
    component.ngAfterViewInit();
    expect(mobileDropdown.removeAttribute).toHaveBeenCalledWith('open');
  });

  // it('should close mobile dropdown on window resize to desktop', (): void => {
  //   const mockDropdown = component.mobileDropdownRef.nativeElement;
  //   spyOn(mockDropdown, 'removeAttribute');
  //   component.onResize({ target: { innerWidth: 1024 } } as never);
  //   expect(mockDropdown.removeAttribute).toHaveBeenCalledWith('open');
  // });
  //
  // it('should not close dropdown on window resize to mobile', (): void => {
  //   const mockDropdown = component.mobileDropdownRef.nativeElement;
  //   spyOn(mockDropdown, 'removeAttribute');
  //   component.onResize({ target: { innerWidth: 500 } } as never);
  //   expect(mockDropdown.removeAttribute).not.toHaveBeenCalled();
  // });
});
