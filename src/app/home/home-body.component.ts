import { Component } from '@angular/core';
import {OrderSubmitterComponent} from '@src/app/orders/order-submitter.component';
import {OrderViewerComponent} from '@src/app/orders/order-viewer.component';

@Component({
  selector: 'app-home-body',
  imports: [OrderSubmitterComponent, OrderViewerComponent],
  templateUrl: './home-body.component.html',
})
export class HomeBodyComponent {
  constructor() { }
}
