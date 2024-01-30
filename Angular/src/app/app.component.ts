import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  // Private data
  @ViewChild('modalContainer', { read: ViewContainerRef })
  private _modalViewContainerRef: ViewContainerRef;

  // Injection
  constructor(private modalService: ModalService) { }

  // After view init
  ngAfterViewInit() {
    this.modalService.init(this._modalViewContainerRef);
  }
}
