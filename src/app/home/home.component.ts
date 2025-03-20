import { Component } from '@angular/core';
import {HomeBodyComponent} from '@src/app/home/home-body.component';
import {HomeHeaderComponent} from '@src/app/home/home-header.component';
import {HomeFooterComponent} from '@src/app/home/home-footer.component';

@Component({
  selector: 'app-home',
  imports: [HomeHeaderComponent, HomeBodyComponent, HomeFooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor() {}
}
