import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {

  // Injection
  constructor(public loadingService: LoadingService) { }

  // On init
  ngOnInit() {
    this.loadingService.init();
  }

  // On click the reconnect button
  onClickReconnectButton() {
    this.loadingService.init();
  }
}
