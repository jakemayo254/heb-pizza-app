import { Component } from '@angular/core';
import { OrderSubmitterComponent } from '@src/app/components/order-submitter.component';
import { OrderViewerComponent } from '@src/app/components/order-viewer.component';

@Component({
  selector: 'app-home-body',
  imports: [OrderSubmitterComponent, OrderViewerComponent],
  template: `
    <div id="home-body" data-testid="home-body" class="flex flex-col flex-grow bg-gray-100">
      <app-order-submitter />
      <app-order-viewer />
    </div>
  `,
})
export class HomeBodyComponent {}
