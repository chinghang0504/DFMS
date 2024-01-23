import { Injectable } from '@angular/core';
import { FileTag } from '../models/file-tag';
import { CommunicationService } from './communication.service';
import { FileTagsPackage } from '../models/file-tags-package';
import { ErrorPackage } from '../models/error-package';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class FileTagsService {

  // Internal data
  private _fileTags: FileTag[] = [];

  // Injection
  constructor(
    private communicationService: CommunicationService, private modalService: ModalService
  ) { }

  // Getters
  get fileTags() {
    return this._fileTags;
  }

  // Check the file tags is empty
  isEmpty(): boolean {
    return this._fileTags.length === 0;
  }

  // Load file tags from the local storage
  loadFileTags(tags: string[]) {
    const fileTags: FileTag[] = tags
      .map((tag: string) => <FileTag>{
        name: tag,
        active: false
      });
    this._fileTags = this.sortFileTags(fileTags);
  }

  // Sort the file tags
  private sortFileTags(fileTags: FileTag[]): FileTag[] {
    fileTags.sort((a, b) => {
      return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    });
    return fileTags;
  }

  // Remove all the file tags in the local storage
  removeAllFileTags() {
    this.communicationService.httpSaveFileTags()
      .subscribe(
        (res: FileTagsPackage) => {
          this.loadFileTags(res.fileTags);
        }, (err) => {
          const errorMessage: string = err['status'] === 400 ? (<ErrorPackage>err['error']).message : 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          this.modalService.executeOneButtonModal(
            'Error', errorMessage, 'OK'
          );
        }
      );
  }

  // Remove a tag
  removeFileTag(tag: string) {
    const index: number = this.findFileTagIndex(tag);
    if (index !== -1) {
      this._fileTags.splice(index, 1);
      this.saveFileTags();
    }
  }

  // Find the index of the specific file tag
  findFileTagIndex(tag: string): number {
    return this._fileTags.findIndex((fileTag: FileTag) => fileTag.name === tag);
  }

  // Save tags into the local storage
  private saveFileTags() {
    const fileTagsPackage: FileTagsPackage = {
      'fileTags': this._fileTags.map((fileTag: FileTag) => fileTag.name)
    };

    this.communicationService.httpSaveFileTags(fileTagsPackage)
      .subscribe(
        (res: FileTagsPackage) => {
          this.loadFileTags(res.fileTags);
        }, (err) => {
          const errorMessage: string = err['status'] === 400 ? (<ErrorPackage>err['error']).message : 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          this.modalService.executeOneButtonModal(
            'Error', errorMessage, 'OK'
          );
        }
      );
  }

  // Add a file tag
  addFileTag(tag: string): boolean {
    if (this.findFileTagIndex(tag) !== -1) {
      return false;
    }

    const fileTags: FileTag[] = [...this._fileTags];
    fileTags.push({ name: tag, active: false });
    this._fileTags = this.sortFileTags(fileTags);
    this.saveFileTags();

    return true;
  }
}
