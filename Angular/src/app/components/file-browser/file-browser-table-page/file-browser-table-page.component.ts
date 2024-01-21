import { Component } from '@angular/core';
import { FileBrowserService } from '../../../services/file-browser.service';

@Component({
  selector: 'app-file-browser-table-page',
  templateUrl: './file-browser-table-page.component.html',
  styleUrl: './file-browser-table-page.component.css'
})
export class FileBrowserTablePageComponent {

  // Injection
  constructor(public fileBrowserService: FileBrowserService) { }

  // On input change the page
  onInputChangePage() {
    this.fileBrowserService.updatePage();
  }

  // On click change the page
  onClickChangePage(next: boolean) {
    this.fileBrowserService.updatePage(next);
  }
}
