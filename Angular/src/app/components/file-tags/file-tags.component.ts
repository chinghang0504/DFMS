import { Component } from '@angular/core';
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
    if (!this.tag) {
      this.helpMessage = 'File tag cannot be empty.';
    } else if (!this.fileTagsService.addFileTag(this.tag)) {
      this.helpMessage = 'This file tag already exists.';
    } else {
      this.clearTagData();
    }
  }

  // On input the tag
  onInputTag() {
    this.helpMessage = '';
  }
}
