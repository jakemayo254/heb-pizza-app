import { Component } from '@angular/core';
import { HomeBodyComponent } from '@src/app/components/home-body.component';
import { HomeFooterComponent } from '@src/app/components/home-footer.component';
import { HomeHeaderComponent } from '@src/app/components/home-header.component';
import { dataTestID } from '@src/app/constants/data-test-id';

@Component({
  selector: 'app-home',
  standalone: true,
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
}

// flex-col = allows the components to stack on top of each other
// flex-grow = take up as much space as possible
// min-h-screen = make sure this entire layout is at least as tall as the screen
