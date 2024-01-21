import { Injectable } from '@angular/core';
import { FileTag } from '../models/file-tag';

@Injectable({
  providedIn: 'root'
})
export class FileTagsService {

  // Keys
  private readonly TAGS_KEY: string = 'TAGS';

  // Internal data
  private _fileTags: FileTag[] = [];

  // Getters
  get fileTags() {
    return this._fileTags;
  }

  // Check the file tags is empty
  isEmpty(): boolean {
    return this._fileTags.length === 0;
  }

  // Load file tags from the local storage
  loadFileTags() {
    const tagString: string = window.localStorage.getItem(this.TAGS_KEY);
    if (!tagString) {
      this._fileTags = [];
      return;
    }

    const tags: string[] = JSON.parse(tagString);
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
    window.localStorage.removeItem(this.TAGS_KEY);
    this._fileTags = [];
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
  private findFileTagIndex(tag: string): number {
    return this._fileTags.findIndex((fileTag: FileTag) => fileTag.name === tag);
  }

  // Save tags into the local storage
  private saveFileTags() {
    if (this.isEmpty()) {
      window.localStorage.removeItem(this.TAGS_KEY);
      return;
    }

    const tags: string[] = this._fileTags.map((fileTag: FileTag) => fileTag.name);
    window.localStorage.setItem(this.TAGS_KEY, JSON.stringify(tags));
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
