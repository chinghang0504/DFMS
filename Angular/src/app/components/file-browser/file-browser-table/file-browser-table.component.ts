import { Component, Input } from '@angular/core';
import { FileBrowserComponent } from '../file-browser/file-browser.component';
import { FileBrowserService } from '../../../services/file-browser.service';
import { CommunicationService } from '../../../services/communication.service';
import { ModalService } from '../../../services/modal.service';
import { DesktopFile } from '../../../models/desktop-file';
import { ErrorPackage } from '../../../packages/error-package';

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
    private communicationService: CommunicationService, private modalService: ModalService
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
      .subscribe(
        (res) => { },
        (err) => {
          if (err['status'] === 400) {
            this.modalService.executeOneButtonModal(
              'Error', (<ErrorPackage>err['error']).message, 'OK'
            );
          } else {
            this.fileBrowserService.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          }
        }
      );
  }

  // On click delete file button
  onClickDeleteFileButton(desktopFile: DesktopFile) {
    this.modalService.executeTwoButtonModal(
      'Delete Confirmation', `Do you want to delete this file ${desktopFile.name}?`, 'Delete', 'Cancel',
      () => {
        this.communicationService.httpDeleteDesktopFile(desktopFile.absolutePath)
          .subscribe(
            (res) => {
              this.parent.getDesktopFilePackage();
            },
            (err) => {
              if (err['status'] === 400) {
                this.modalService.executeOneButtonModal(
                  'Error', (<ErrorPackage>err['error']).message, 'OK'
                );
              } else {
                this.fileBrowserService.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
              }
            }
          );
      }
    );
  }

  // On click the file details button
  onClickFileDetailsButton(desktopFilePath: string) {
    this.parent.navigateFileDetails(desktopFilePath);
  }
}
