import { Injectable } from '@angular/core';
import { TagsPackage } from '../models/packages/tags.package';
import { LoadingService } from './loading.service';
import { CommunicationService } from './communication.service';
import { ModalService } from './modal.service';
import { ErrorManager } from '../managers/error.manager';
import { finalize } from 'rxjs';
import { FileTag } from '../models/file-tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  // Public data
  fileTags: FileTag[];
  newTag: string = '';
  helpMessage: string = '';

  // Injection
  constructor(private loadingService: LoadingService, private communicationService: CommunicationService, private modalService: ModalService) { }

  // Getters
  get isTagsEmpty() {
    return this.fileTags.length === 0;
  }

  // Init
  init(tagsPackage: TagsPackage) {
    this.loadTagsPackage(tagsPackage);
  }

  // Load the tags package
  private loadTagsPackage(tagsPackage: TagsPackage) {
    const fileTags: FileTag[] = tagsPackage.tags.map((tag: string) => <FileTag>{ tag: tag, active: false });
    this.fileTags = this.sortFileTags(fileTags);
  }

  // Sort the file tags
  private sortFileTags(fileTags: FileTag[]): FileTag[] {
    fileTags.sort((a: FileTag, b: FileTag) => {
      return a.tag.toLocaleLowerCase().localeCompare(b.tag.toLocaleLowerCase());
    });
    return fileTags;
  }

  // Remove all the tags
  removeAllTags() {
    this.saveTagsPackage();
  }

  // Save the tags
  private saveTagsPackage(tagsPackage?: TagsPackage, previousFileTags?: FileTag[]) {
    this.loadingService.isLoading = true;

    this.communicationService.httpSaveTags(tagsPackage)
      .pipe(
        finalize(() => {
          this.loadingService.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.fileTags = previousFileTags ? previousFileTags : [];

          this.newTag = '';
          this.helpMessage = '';
        },
        error: (err: any) => {
          ErrorManager.handleError(err, this.modalService, this.loadingService);
        }
      });
  }

  // Remove a tag
  removeTag(index: number) {
    const fileTags: FileTag[] = [...this.fileTags];
    fileTags.splice(index, 1);
    this.saveFileTags(fileTags);
  }

  // Save the file tags
  private saveFileTags(fileTags: FileTag[]) {
    const tags: string[] = fileTags.map((fileTag: FileTag) => fileTag.tag);
    this.saveTagsPackage({ tags: tags }, fileTags);
  }

  // Check the new tag
  checkNewTag(): boolean {
    if (!this.newTag) {
      this.helpMessage = 'The tag name cannot be empty.';
      return false;
    } else if (this.isTagExist(this.newTag)) {
      this.helpMessage = 'This tag already exists.';
      return false;
    }

    this.helpMessage = '';
    return true;
  }

  // Is the tag exist
  private isTagExist(tag: string): boolean {
    return this.fileTags.findIndex((fileTag: FileTag) => fileTag.tag === tag) !== -1;
  }

  // Add a tag
  addTag() {
    if (!this.checkNewTag()) {
      return;
    }

    let fileTags: FileTag[] = [...this.fileTags];
    fileTags.push({ tag: this.newTag, active: false });
    fileTags = this.sortFileTags(fileTags);

    this.saveFileTags(fileTags);
  }
}
