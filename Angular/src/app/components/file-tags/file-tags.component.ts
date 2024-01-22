import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileTagsService } from '../../services/file-tags.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-file-tags',
  templateUrl: './file-tags.component.html',
  styleUrl: './file-tags.component.css'
})
export class FileTagsComponent {

  // UI data
  tag: string = '';
  helpMessage: string = '';
  validTag: boolean = false;

  // Injection
  constructor(
    public fileTagsService: FileTagsService,
    private modalService: ModalService
  ) { }

  // On click the remove all button
  onClickRemoveAllButton() {
    this.modalService.executeTwoButtonModal(
      'Remove Confirmation', 'Do you want to remove all file tags?', 'Remove', 'Cancel',
      () => {
        this.fileTagsService.removeAllFileTags();
        this.clearTagData();
      }
    );
  }

  // Clear the tag data
  private clearTagData() {
    this.tag = '';
    this.helpMessage = '';
    this.validTag = false;
  }

  // On click the file tag button
  onClickFileTagButton(tag: string) {
    this.modalService.executeTwoButtonModal(
      'Remove Confirmation', `Do you want to remove this file tag ${tag}?`, 'Remove', 'Cancel',
      () => {
        this.fileTagsService.removeFileTag(tag);
        this.clearTagData();
      }
    );
  }

  // On click the add button
  onClickAddButton() {
    if (this.checkTag() && this.fileTagsService.addFileTag(this.tag)) {
      this.clearTagData();
    }
  }

  // On input the tag
  onInputTag() {
    this.checkTag();
  }

  // Check the tag
  checkTag(): boolean {
    if (!this.tag) {
      this.helpMessage = 'File tag cannot be empty.';
      this.validTag = false;
      return false;
    } else if (this.fileTagsService.findFileTagIndex(this.tag) !== -1) {
      this.helpMessage = 'This file tag already exists.';
      this.validTag = false;
      return false;
    }

    this.helpMessage = '';
    this.validTag = true;
    return true;
  }
}
