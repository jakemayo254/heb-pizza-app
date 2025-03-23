import { Component } from '@angular/core';
import { OrderSubmitterComponent } from '@src/app/components/order-submitter.component';
import { OrderViewerComponent } from '@src/app/components/order-viewer.component';
import { dataTestID } from '@src/app/constants/data-test-id';

@Component({
  selector: 'app-home-body',
  imports: [OrderSubmitterComponent, OrderViewerComponent],
  template: `
    <div [attr.data-testid]="dataTestID.appHomeBody" class="flex flex-grow flex-col bg-gray-100">
      <app-order-submitter />
      <app-order-viewer />
    </div>
  `,
})
export class HomeBodyComponent {
  protected readonly dataTestID = dataTestID;
}
