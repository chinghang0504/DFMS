import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommunicationService } from '../../../services/communication.service';
import { ErrorPackage } from '../../../models/packages/error.package';
import { FileDetailsComponent } from '../file-details/file-details.component';
import { DesktopFile } from '../../../models/desktop-file.model';
import { finalize } from 'rxjs';
import { SettingsService } from '../../../services/settings.service';
import { TagsService } from '../../../services/tags.service';
import { FileTag } from '../../../models/file-tag.model';
import { TagsPackage } from '../../../models/packages/tags.package';

@Component({
  selector: 'app-file-details-file-tags',
  templateUrl: './file-details-file-tags.component.html',
  styleUrl: './file-details-file-tags.component.css'
})
export class FileDetailsFileTagsComponent implements OnInit {

  // UI data
  @Input() parent: FileDetailsComponent;
  @Input() desktopFile: DesktopFile;
  availableTags: string[] = [];

  // Injection
  constructor(
    public tagsService: TagsService,
    private settingsService: SettingsService, private communicationService: CommunicationService, private modalService: ModalService
  ) { }

  // On init
  ngOnInit() {
    this.updateAvailableTags();
  }

  // Update the available tags
  private updateAvailableTags() {
    this.availableTags = [];
    this.tagsService.fileTags.forEach((fileTag: FileTag) => {
      if (!this.desktopFile.tags.includes(fileTag.tag)) {
        this.availableTags.push(fileTag.tag);
      }
    });
  }

  // Is the tags empty
  isEmptyTags(): boolean {
    return this.desktopFile.tags.length === 0;
  }

  // Is the available tags empty
  isEmptyAvailableTags(): boolean {
    return this.availableTags.length === 0;
  }

  // On click remove file tags
  onClickRemoveFileTag(index: number) {
    const executeAction: () => void = () => {
      this.desktopFile.tags.splice(index, 1);
      this.saveChanges();
    };

    if (this.settingsService.originalSettingsPackage.tagRemovalDoubleConfirmation) {
      this.modalService.executeTwoButtonModal(
        'Remove Confirmation', `Do you want to remove ${this.desktopFile.tags[index]} from this file?`, 'Remove', 'Cancel',
        () => {
          executeAction();
        }
      );
    }
    else {
      executeAction();
    }
  }

  // Save changes
  private saveChanges() {
    const tagsPackage: TagsPackage = { tags: this.desktopFile.tags };
    this.communicationService.httpModifyDesktopFile(this.desktopFile.absolutePath, tagsPackage)
      .pipe(finalize(() => {
        this.parent.updateData();
        this.updateAvailableTags();
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
      this.saveChanges();
    }
  }

  // Check the repeated tag
  private checkTag(tag: string): boolean {
    return this.desktopFile.tags.indexOf(tag) === -1;
  }
}
