import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommunicationService } from '../../../services/communication.service';
import { ErrorPackage } from '../../../models/error-package';
import { FileTagsService } from '../../../services/file-tags.service';
import { FileDetailsComponent } from '../file-details/file-details.component';
import { DesktopFile } from '../../../models/desktop-file';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-file-details-file-tags',
  templateUrl: './file-details-file-tags.component.html',
  styleUrl: './file-details-file-tags.component.css'
})
export class FileDetailsFileTagsComponent {

  @Input() parent: FileDetailsComponent;
  @Input() desktopFile: DesktopFile;

  // Injection
  constructor(
    public fileTagsService: FileTagsService,
    private communicationService: CommunicationService, private modalService: ModalService
  ) { }

  // On click remove file tags
  onClickRemoveFileTag(tag: string) {
    const index: number = this.desktopFile.tags.indexOf(tag);
    if (index !== -1) {
      this.desktopFile.tags.splice(index, 1);
    }
  }

  // On click the save button
  onClickSaveButton() {
    this.modalService.executeTwoButtonModal(
      'Save Confirmation', 'Do you want to save any changes?', 'Save', 'Cancel',
      () => {
        this.saveChanges();
      }
    );
  }

  // Save changes
  private saveChanges() {
    this.communicationService.httpModifyDesktopFile(this.desktopFile.absolutePath, this.desktopFile.tags)
      .pipe(finalize(() => {
        this.parent.updateData();
      }))
      .subscribe(
        () => { },
        (err) => {
          const errorMessage: string = err['status'] === 400 ? (<ErrorPackage>err['error']).message : 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          this.modalService.executeOneButtonModal(
            'Error', errorMessage, 'OK'
          );
        }
      );
  }

  // On click the clear button
  onClickClearButton() {
    this.modalService.executeTwoButtonModal(
      'Clear Confirmation', 'Do you want to clear all tags from this file?', 'Clear', 'Cancel',
      () => {
        this.desktopFile.tags = [];
        this.saveChanges();
      }
    );
  }

  // On click to add a file tag
  onClickAddFileTag(tag: string) {
    if (this.checkTag(tag)) {
      const tags: string[] = [...this.desktopFile.tags];
      tags.push(tag);
      tags.sort((a, b) => {
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
      });
      this.desktopFile.tags = tags;
    }
  }

  // Check the repeated tag
  private checkTag(tag: string): boolean {
    return this.desktopFile.tags.indexOf(tag) === -1;
  }
}
