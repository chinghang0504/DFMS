import { Injectable } from '@angular/core';
import { HomeService } from './home.service';
import { SearchingTag } from '../models/searching-tag';

@Injectable({
  providedIn: 'root'
})
export class SystemTagsService {

  // Keys
  private readonly TAGS_KEY: string = 'TAGS';

  // Internal data
  private _tags: string[] = [];

  // Injection
  constructor(private homeService: HomeService) { }

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
    if (tags) {
      this._tags = this.sortTags(JSON.parse(tags));

      this.homeService.searchingTags = this._tags.map((tag) => {
        return { name: tag, active: false };
      });
    } else {
      this._tags = [];

      this.homeService.searchingTags = [];
    }
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

    this.homeService.searchingTags = [];
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

      const searchingTags: SearchingTag[] = [...this.homeService.searchingTags];
      searchingTags.push({ name: tag, active: false });
      this.homeService.searchingTags = this.sortSearchingTags(searchingTags);

      return true;
    }

    return false;
  }

  // Check repeated tag
  private checkTag(tag: string): boolean {
    return this._tags.indexOf(tag) === -1;
  }

  // Sort the searching tags
  private sortSearchingTags(searchingTags: SearchingTag[]): SearchingTag[] {
    searchingTags.sort((a, b) => {
      return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    });
    return searchingTags;
  }

  // Remove a tag
  removeTag(tag: string) {
    const index: number = this._tags.indexOf(tag);
    if (index !== -1) {
      this._tags.splice(index, 1);
      this.saveTags();
    }

    const searchingIndex: number = this.homeService.searchingTags.findIndex((searchingTag) => {
      return searchingTag.name === tag;
    });
    if (index !== -1) {
      this.homeService.searchingTags.splice(searchingIndex, 1);
    }
  }
}
