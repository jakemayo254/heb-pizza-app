import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeFooterComponent } from '@src/app/components/home-footer.component';
import { dataTestID } from '@src/app/constants/data-test-id';

describe('HomeFooterComponent', (): void => {
  let fixture: ComponentFixture<HomeFooterComponent>;
  let getRoot: () => HTMLElement | null;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [HomeFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFooterComponent);

    getRoot = () => fixture.nativeElement.querySelector(`[data-testid="${dataTestID.appHomeFooter}"]`);
  });

  it('should render the root container with the correct data-testid', (): void => {
    fixture.detectChanges();
    expect(getRoot()).toBeTruthy();
  });

  it('should display the correct footer text', (): void => {
    fixture.detectChanges();
    const root = getRoot();
    expect(root?.textContent?.trim()).toBe('Made By Jake Mayo 2025');
  });
});
