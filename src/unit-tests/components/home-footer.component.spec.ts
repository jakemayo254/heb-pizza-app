import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeFooterComponent } from '@src/app/components/home-footer.component';
import { dataTestID } from '@src/app/constants/data-test-id';

describe('HomeFooterComponent', (): void => {
  let component: HomeFooterComponent;
  let fixture: ComponentFixture<HomeFooterComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [HomeFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', (): void => {
    expect(component).toBeTruthy();
  });

  it('should render footer container with correct data-testid', (): void => {
    const footer = fixture.debugElement.query(By.css(`[data-testid="${dataTestID.appHomeFooter}"]`));
    expect(footer).toBeTruthy();
  });

  it('should render correct footer text', (): void => {
    const footerText = fixture.nativeElement.textContent;
    expect(footerText).toContain('Made By Jake Mayo 2025');
  });
});
