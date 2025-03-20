import { Component } from '@angular/core';
import {HomeBodyComponent} from '@src/app/home/home-body.component';
import {HomeHeaderComponent} from '@src/app/home/home-header.component';
import {HomeFooterComponent} from '@src/app/home/home-footer.component';
import {OrdersStateService} from '@src/app/services/orders-state.service';

@Component({
  selector: 'app-home',
  imports: [HomeHeaderComponent, HomeBodyComponent, HomeFooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private ordersState: OrdersStateService) {
    ordersState.getOrdersFromApi();
  }
}
