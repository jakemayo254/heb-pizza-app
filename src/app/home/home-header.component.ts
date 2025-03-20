import { Component } from '@angular/core';
import {AuthStateService} from '@src/app/services/auth-state.service';

@Component({
  selector: 'app-home-header',
  imports: [],
  templateUrl: './home-header.component.html',
})
export class HomeHeaderComponent {
  constructor(protected authState: AuthStateService) { }
}
