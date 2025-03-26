import { Component } from '@angular/core';
import { dataTestID } from '@src/app/constants/data-test-id';

@Component({
  selector: 'app-home-footer',
  standalone: true,
  imports: [],
  template: `
    <div [attr.data-testid]="dataTestID.appHomeFooter" class="bg-heb-gray text-center text-white">
      <h3>Made By Jake Mayo 2025</h3>
    </div>
  `,
})
export class HomeFooterComponent {
  protected readonly dataTestID = dataTestID;
}
