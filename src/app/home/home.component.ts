import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeBodyComponent} from '@src/app/home/home-body.component';
import {HomeHeaderComponent} from '@src/app/home/home-header.component';
import {HomeFooterComponent} from '@src/app/home/home-footer.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HomeHeaderComponent, HomeBodyComponent, HomeFooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor() {}
}
