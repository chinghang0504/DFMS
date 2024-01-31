import { Component } from '@angular/core';
import { TagsService } from '../../../services/tags.service';
import { FileBrowserService } from '../../../services/file-browser.service';
import { FileTag } from '../../../models/file-tag.model';

@Component({
  selector: 'app-file-browser-filter',
  templateUrl: './file-browser-filter.component.html',
  styleUrl: './file-browser-filter.component.css'
})
export class FileBrowserFilterComponent {

  // Injection
  constructor(
    public fileBrowserService: FileBrowserService, public tagsService: TagsService
  ) { }

  // On click the filter button
  onClickFilterButton() {
    this.fileBrowserService.enableFilter = !this.fileBrowserService.enableFilter;
    this.fileBrowserService.updateDesktopFiles();
  }

  // On click the file type button
  onClickFileTypeButton(isFile: boolean) {
    if (isFile) {
      this.fileBrowserService.fileterIsFile = !this.fileBrowserService.fileterIsFile;
    } else {
      this.fileBrowserService.fileterIsFolder = !this.fileBrowserService.fileterIsFolder;
    }

    this.fileBrowserService.updateDesktopFiles();
  }

  // On input the file name
  onInputFileName() {
    this.fileBrowserService.updateDesktopFiles();
  }

  // On click the file tag button
  onClickFileTagButton(fileTag: FileTag) {
    fileTag.active = !fileTag.active;
    this.fileBrowserService.updateDesktopFiles();
  }

  // On click the clear button
  onClickClearButton() {
    if (this.fileBrowserService.filterFileName) {
      this.fileBrowserService.filterFileName = '';
      this.fileBrowserService.updateDesktopFiles();
    }
  }
}
