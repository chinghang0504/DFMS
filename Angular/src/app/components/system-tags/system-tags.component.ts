import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SystemTagsService } from '../../services/system-tags.service';

@Component({
  selector: 'app-system-tags',
  templateUrl: './system-tags.component.html',
  styleUrl: './system-tags.component.css'
})
export class SystemTagsComponent {
  
  // UI data
  tagName: string = '';
  helpMessage: string = '';

  // Injection
  constructor(public systemTagsService: SystemTagsService, private modalService: ModalService) { }

  // On click the clear button
  onClickClearButton() {
    this.modalService.executeTwoButtonModal(
      'Clear Confirmation', 'Do you want to clear all system tags', 'Clear', 'Cancel',
      () => {
        this.systemTagsService.clearTags();
      }
    );
  }

  // On click the save button
  onClickSaveButton() {
    if (!this.tagName) {
      this.helpMessage = 'The system tag name cannot be empty.';
    } else {
      if (this.systemTagsService.addTag(this.tagName)) {
        this.tagName = '';
        this.helpMessage = '';
      } else {
        this.helpMessage = 'This system tag name already exists.';
      }
    }
  }

  // On click tag button
  onClickTagButton(tag: string) {
    this.modalService.executeTwoButtonModal(
      'Remove Confirmation', 'Do you want to remove this system tag', 'Remove', 'Cancel',
      () => {
        this.systemTagsService.removeTag(tag);
      }
    );
  }
}
