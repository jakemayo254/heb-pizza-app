import { Component } from '@angular/core';
import { HomeBodyComponent } from '@src/app/components/home-body.component';
import { HomeFooterComponent } from '@src/app/components/home-footer.component';
import { HomeHeaderComponent } from '@src/app/components/home-header.component';
import { dataTestID } from '@src/app/models/data-test-id';
import { OrdersStateService } from '@src/app/services/orders-state.service';

@Component({
  selector: 'app-home',
  imports: [HomeHeaderComponent, HomeBodyComponent, HomeFooterComponent],
  template: `
    <div [attr.data-testid]="dataTestID.appHome" class="bg-heb-light-grey flex min-h-screen flex-col">
      <app-home-header />
      <app-home-body class="flex-grow" />
      <app-home-footer />
    </div>
  `,
})
export class HomeComponent {
  protected readonly dataTestID = dataTestID;

  constructor(private readonly ordersState: OrdersStateService) {
    // need orders list right when the home page is loaded
    this.ordersState.getOrdersFromApi();
  }
}
