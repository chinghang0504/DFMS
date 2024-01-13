import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  // Keys
  private readonly TAGS_KEY: string = 'TAGS';

  // Internal data
  private _tags: string[] = [];

  // Getters
  get tags() {
    return this._tags;
  }

  // Check empty
  isEmpty(): boolean {
    return this._tags.length === 0;
  }

  // Load tags from the local storage
  loadTags() {
    const tags: string = window.localStorage.getItem(this.TAGS_KEY);
    this._tags = tags ? this.sortTags(JSON.parse(tags)) : [];
  }

  // Sort the tags
  private sortTags(tags: string[]): string[] {
    tags.sort((a, b) => {
      return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
    });
    return tags;
  }

  // Clear tags in the local storage
  clearTags() {
    this._tags = [];
    this.saveTags();
  }

  // Save tags into the local storage
  private saveTags() {
    window.localStorage.setItem(this.TAGS_KEY, JSON.stringify(this._tags));
  }

  // Add a tag
  addTag(tag: string): boolean {
    if (this.checkTag(tag)) {
      const tags: string[] = [...this._tags];
      tags.push(tag);
      this._tags = this.sortTags(tags);
      this.saveTags();

      return true;
    }

    return false;
  }

  // Check repeated tag
  private checkTag(tag: string): boolean {
    return this._tags.indexOf(tag) === -1;
  }

  // Remove a tag
  removeTag(tag: string) {
    const index: number = this._tags.indexOf(tag);
    if (index != -1) {
      this._tags.splice(index, 1);
      this.saveTags();
    }
  }
}