import { Component } from '@angular/core';
import { TagsService } from '../../services/tags.service';
import { LoadingService } from '../../services/loading.service';
import { ModalService } from '../../services/modal.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {

  // Injection
  constructor(
    public loadingService: LoadingService, public tagsService: TagsService,
    private modalService: ModalService, private settingsService: SettingsService
  ) { }

  // On click the remove button
  onClickRemoveButton(index: number, tag: string) {
    if (this.settingsService.originalSettingsPackage.tagRemovalDoubleConfirmation) {
      this.modalService.executeTwoButtonModal(
        'Tag Remove Confirmation', `Do you want to remove <b>${tag}</b> tag from the system?`, 'Remove', 'Cancel',
        () => {
          this.tagsService.removeTag(index);
        }
      );
    } else {
      this.tagsService.removeTag(index);
    }
  }

  // On click the remove all button
  onClickRemoveAllButton() {
    this.modalService.executeTwoButtonModal(
      'Tag Remove Confirmation', 'Do you want to remove all the tags from the system?', 'Remove', 'Cancel',
      () => {
        this.tagsService.removeAllTags();
      }
    );
  }

  // On input the new tag
  onInputNewTag() {
    this.tagsService.checkNewTag();
  }

  // On click the add button
  onClickAddButton() {
    this.tagsService.addTag();
  }
}
