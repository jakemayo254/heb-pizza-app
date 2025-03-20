import { Component } from '@angular/core';
import { OrderSubmitterComponent } from '@src/app/components/order-submitter.component';
import { OrderViewerComponent } from '@src/app/components/order-viewer.component';

@Component({
  selector: 'app-home-body',
  imports: [OrderSubmitterComponent, OrderViewerComponent],
  template: `
    <div id="home-body" data-testid="home-body" class="bg-white flex-grow">
      <app-order-submitter></app-order-submitter>
      <app-order-viewer></app-order-viewer>
    </div>
  `,
})
export class HomeBodyComponent {}
