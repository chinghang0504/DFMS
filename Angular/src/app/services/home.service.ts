import { Injectable } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';
import { SettingsService } from './settings.service';
import { DesktopFilePackage } from '../models/desktop-file-package';
import { SortingMode } from '../models/sorting-mode';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // Persistent data
  private _currentFolderPath: string = "";
  private _allFiles: boolean = false;
  private _desktopFiles: DesktopFile[] = [];
  private _sortingMode: SortingMode = SortingMode.NAME_ASCENDING;

  // Package Data
  private _folderList: DesktopFile[];
  private _fileList: DesktopFile[];

  // Injection
  constructor(private settingsService: SettingsService) { }

  // Getters and Setters
  get currentFolderPath() {
    return this._currentFolderPath;
  }
  set currentFolderPath(value) {
    this._currentFolderPath = value;
  }
  get allFiles() {
    return this._allFiles;
  }
  set allFiles(value) {
    this._allFiles = value;
  }
  get desktopFiles() {
    return this._desktopFiles;
  }
  get sortingMode() {
    return this._sortingMode;
  }
  set sortingMode(value) {
    this._sortingMode = value;
  }

  // Update the desktop files
  updateDesktopFiles(desktopFilePackage?: DesktopFilePackage) {
    if (desktopFilePackage) {
      this._folderList = desktopFilePackage.folderList;
      this._fileList = desktopFilePackage.fileList;
    }

    const tempFolderList: DesktopFile[] = this.filterDesktopFiles(this._folderList);
    const tempFileList: DesktopFile[] = this.filterDesktopFiles(this._fileList);

    this.sortDesktopFiles(tempFolderList);
    this.sortDesktopFiles(tempFileList);

    this._desktopFiles = tempFolderList.concat(tempFileList);
  }

  // Filter the desktop files
  private filterDesktopFiles(desktopFiles: DesktopFile[]): DesktopFile[] {
    return desktopFiles.filter(
      (desktopFile: DesktopFile) => {
        if (!this.settingsService.showHidden) {
          return !desktopFile.isHidden;
        }

        return true;
      }
    );
  }

  // Sort the desktop files
  private sortDesktopFiles(desktopFiles: DesktopFile[]) {
    if (this._sortingMode === SortingMode.NAME_ASCENDING || this._sortingMode === SortingMode.NAME_DESCENDING) {
      const factor: number = this._sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()) * factor;
      });
    } else if (this._sortingMode === SortingMode.LAST_MODIFIED_ASCENDING || this._sortingMode === SortingMode.LAST_MODIFIED_DESCENDING) {
      const factor: number = this._sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return (a.lastModified - b.lastModified) * factor;
      });
    } else if (this._sortingMode === SortingMode.TYPE_ASCENDING || this._sortingMode === SortingMode.TYPE_DESCENDING) {
      const factor: number = this._sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return a.extension.toLocaleLowerCase().localeCompare(b.extension.toLocaleLowerCase()) * factor;
      });
    } else if (this._sortingMode === SortingMode.SIZE_ASCENDING || this._sortingMode === SortingMode.SIZE_DESCENDING) {
      const factor: number = this._sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return (a.size - b.size) * factor;
      });
    }
  }
}