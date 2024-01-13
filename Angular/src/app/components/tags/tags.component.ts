import { Component } from '@angular/core';
import { TagsService } from '../../services/tags.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {

  // UI data
  tagName: string = '';
  helpMessage: string = '';

  // Injection
  constructor(public tagsService: TagsService, private modalService: ModalService) { }

  // On click the clear button
  onClickClearButton() {
    this.modalService.executeTwoButtonModal(
      'Clear Confirmation', 'Do you want to clear all tags', 'Clear', 'Cancel',
      () => {
        this.tagsService.clearTags();
      }
    );
  }

  // On click the save button
  onClickSaveButton() {
    if (!this.tagName) {
      this.helpMessage = 'The tag name cannot be empty.';
    } else {
      if (this.tagsService.addTag(this.tagName)) {
        this.tagName = '';
        this.helpMessage = '';
      } else {
        this.helpMessage = 'This tag name already exists.';
      }
    }
  }

  // On click tag button
  onClickTagButton(tag: string) {
    this.modalService.executeTwoButtonModal(
      'Remove Confirmation', 'Do you want to remove this tag', 'Remove', 'Cancel',
      () => {
        this.tagsService.removeTag(tag);
      }
    );
  }
}