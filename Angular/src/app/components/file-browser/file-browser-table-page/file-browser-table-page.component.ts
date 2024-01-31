import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FileBrowserService } from '../../../services/file-browser.service';

@Component({
  selector: 'app-file-browser-table-page',
  templateUrl: './file-browser-table-page.component.html',
  styleUrl: './file-browser-table-page.component.css'
})
export class FileBrowserTablePageComponent implements OnInit {

  // Private data
  @Input()
  private allowKeydownListener: boolean = false;

  // Injection
  constructor(public fileBrowserService: FileBrowserService, private renderer2: Renderer2, private elementRef: ElementRef) { }

  // On init
  ngOnInit() {
    if (this.allowKeydownListener) {
      this.renderer2.listen('document', 'keydown', (event) => {
        switch (event.key) {
          case 'ArrowLeft':
            this.fileBrowserService.updatePage(-1);
            break;
          case 'ArrowRight':
            this.fileBrowserService.updatePage(1);
            break;
          case '0':
            this.fileBrowserService.currentPageNumber = 1;
            this.fileBrowserService.updatePage();
            break;
        }
      });
    }
  }

  // On input change the page
  onInputChangePage() {
    this.fileBrowserService.updatePage();
  }

  // On click change the page
  onClickChangePage(changeNumber: number) {
    this.fileBrowserService.updatePage(changeNumber);
  }
}
