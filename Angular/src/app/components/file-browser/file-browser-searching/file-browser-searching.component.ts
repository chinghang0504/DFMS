import { Component } from '@angular/core';
import { FileBrowserService } from '../../../services/file-browser.service';
import { FileTagsService } from '../../../services/file-tags.service';
import { FileTag } from '../../../models/file-tag';

@Component({
  selector: 'app-file-browser-searching',
  templateUrl: './file-browser-searching.component.html',
  styleUrl: './file-browser-searching.component.css'
})
export class FileBrowserSearchingComponent {

  // Injection
  constructor(
    public fileBrowserService: FileBrowserService, public fileTagsService: FileTagsService
  ) { }

  // On click the searching button
  onClickSearchingButton() {
    this.fileBrowserService.enableSearching = !this.fileBrowserService.enableSearching;
    this.fileBrowserService.updateDesktopFiles();
  }

  // On input the searching name
  onInputSearchingName() {
    this.fileBrowserService.updateDesktopFiles();
  }

  // On click the searching tag button
  onClickSearchingTagButton(fileTag: FileTag) {
    fileTag.active = !fileTag.active;
    this.fileBrowserService.updateDesktopFiles();
  }
}
