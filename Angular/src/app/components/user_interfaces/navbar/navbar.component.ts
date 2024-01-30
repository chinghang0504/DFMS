import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Injection
  constructor(private loadingService: LoadingService) { }

  // On click the navbar item
  onClickNavbarItem() {
    this.loadingService.init();
  }
}
