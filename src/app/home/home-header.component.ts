import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthStateService} from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-home-header',
  imports: [CommonModule],
  templateUrl: './home-header.component.html',
})
export class HomeHeaderComponent {
  constructor(protected authState: AuthStateService) {
  }
}
