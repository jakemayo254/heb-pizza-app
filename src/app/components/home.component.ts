import { Component } from '@angular/core';
import { HomeBodyComponent } from '@src/app/components/home-body.component';
import { HomeFooterComponent } from '@src/app/components/home-footer.component';
import { HomeHeaderComponent } from '@src/app/components/home-header.component';
import { OrdersStateService } from '@src/app/services/orders-state.service';

@Component({
  selector: 'app-home',
  imports: [HomeHeaderComponent, HomeBodyComponent, HomeFooterComponent],
  template: `
    <div id="home" data-testid="home" class="flex flex-col min-h-screen">
      <app-home-header></app-home-header>
      <app-home-body class="flex-grow"></app-home-body>
      <app-home-footer></app-home-footer>
    </div>
  `,
})
export class HomeComponent {
  constructor(private ordersState: OrdersStateService) {
    // need orders list right when the home page is loaded
    this.ordersState.getOrdersFromApi();
  }
}
