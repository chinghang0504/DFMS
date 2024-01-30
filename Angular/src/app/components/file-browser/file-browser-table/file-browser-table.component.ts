import { Component, Input } from '@angular/core';
import { FileBrowserComponent } from '../file-browser/file-browser.component';
import { FileBrowserService } from '../../../services/file-browser.service';
import { CommunicationService } from '../../../services/communication.service';
import { ModalService } from '../../../services/modal.service';
import { DesktopFile } from '../../../models/desktop-file.model';
import { ErrorManager } from '../../../managers/error.manager';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-file-browser-table',
  templateUrl: './file-browser-table.component.html',
  styleUrl: './file-browser-table.component.css'
})
export class FileBrowserTableComponent {

  // Parent
  @Input() parent: FileBrowserComponent;

  // Injection
  constructor(
    public fileBrowserService: FileBrowserService,
    private communicationService: CommunicationService, private modalService: ModalService, private loadingService: LoadingService
  ) { }

  // On click the table header
  onClickTableHeader(tableHeader: number) {
    this.fileBrowserService.sortingMode = this.fileBrowserService.sortingMode === tableHeader ? tableHeader + 1 : tableHeader;
    this.fileBrowserService.updateDesktopFiles();
  }

  // On click the element name
  onClickElementName(desktopFile: DesktopFile) {
    if (desktopFile.isFolder) {
      this.parent.navigate(desktopFile.absolutePath);
    }
  }

  // On click the open file button
  onClickOpenFileButton(desktopFilePath: string) {
    this.communicationService.httpOpenDesktopFile(desktopFilePath)
      .subscribe({
        next: () => { },
        error: (err: any) => {
          ErrorManager.handleError(err, this.modalService, this.loadingService);
        }
      });
  }

  // On click the file details button
  onClickFileDetailsButton(desktopFilePath: string) {
    this.parent.navigateFileDetails(desktopFilePath);
  }
}
