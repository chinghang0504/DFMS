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
  private _enableSearching: boolean = false;
  private _searchingInput: string = "";

  // Package Data
  private _folderList: DesktopFile[];
  private _fileList: DesktopFile[];

  // Worker
  private _worker: Worker;

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
  set desktopFiles(value) {
    this._desktopFiles = value;
  }
  get sortingMode() {
    return this._sortingMode;
  }
  set sortingMode(value) {
    this._sortingMode = value;
  }
  get enableSearching() {
    return this._enableSearching;
  }
  set enableSearching(value) {
    this._enableSearching = value;
  }
  get searchingInput() {
    return this._searchingInput;
  }
  set searchingInput(value) {
    this._searchingInput = value;
  }

  // Update the desktop files
  updateDesktopFiles(desktopFilePackage?: DesktopFilePackage) {
    if (desktopFilePackage) {
      this._folderList = desktopFilePackage.folderList;
      this._fileList = desktopFilePackage.fileList;
    }

    if (typeof Worker !== 'undefined') {
      console.log('Start');
      this._worker = new Worker(new URL('../workers/home.worker', import.meta.url));

      this._worker.onmessage = ({ data }) => {
        this._desktopFiles = data;
        console.log('End');
      };

      this._worker.postMessage({
        folderList: this._folderList,
        fileList: this._fileList,
        sortingMode: this._sortingMode,
        enableSearching: this._enableSearching,
        searchingInput: this._searchingInput,
        showHidden: this.settingsService.showHidden
      });
    } else {
      const tempFolderList: DesktopFile[] = HomeService.filterDesktopFiles(this._folderList, this.settingsService.showHidden, this._enableSearching, this._searchingInput);
      const tempFileList: DesktopFile[] = HomeService.filterDesktopFiles(this._fileList, this.settingsService.showHidden, this._enableSearching, this._searchingInput);

      HomeService.sortDesktopFiles(tempFolderList, this._sortingMode);
      HomeService.sortDesktopFiles(tempFileList, this._sortingMode);

      this._desktopFiles = tempFolderList.concat(tempFileList).slice(0, 1000);
    }
  }

  // Update the desktop files though worker
  static updateDesktopFilesWorker(data: { folderList: DesktopFile[], fileList: DesktopFile[], sortingMode: SortingMode, enableSearching: boolean, searchingInput: string, showHidden: boolean; }) {
    const tempFolderList: DesktopFile[] = HomeService.filterDesktopFiles(data.folderList, data.showHidden, data.enableSearching, data.searchingInput);
    const tempFileList: DesktopFile[] = HomeService.filterDesktopFiles(data.fileList, data.showHidden, data.enableSearching, data.searchingInput);

    HomeService.sortDesktopFiles(tempFolderList, data.sortingMode);
    HomeService.sortDesktopFiles(tempFileList, data.sortingMode);

    return tempFolderList.concat(tempFileList).slice(0, 1000);
  }

  // Filter the desktop files
  static filterDesktopFiles(desktopFiles: DesktopFile[], showHidden: boolean, enableSearching: boolean, searchingInput: string): DesktopFile[] {
    return desktopFiles.filter(
      (desktopFile: DesktopFile) => {
        if (!showHidden && desktopFile.isHidden) {
          return false;
        }

        if (enableSearching && searchingInput) {
          return desktopFile.name.toLocaleLowerCase().indexOf(searchingInput.toLocaleLowerCase()) != -1;
        }

        return true;
      }
    );
  }

  // Sort the desktop files
  static sortDesktopFiles(desktopFiles: DesktopFile[], sortingMode: SortingMode) {
    if (sortingMode === SortingMode.NAME_ASCENDING || sortingMode === SortingMode.NAME_DESCENDING) {
      const factor: number = sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()) * factor;
      });
    } else if (sortingMode === SortingMode.LAST_MODIFIED_ASCENDING || sortingMode === SortingMode.LAST_MODIFIED_DESCENDING) {
      const factor: number = sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return (a.lastModified - b.lastModified) * factor;
      });
    } else if (sortingMode === SortingMode.TYPE_ASCENDING || sortingMode === SortingMode.TYPE_DESCENDING) {
      const factor: number = sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return a.extension.toLocaleLowerCase().localeCompare(b.extension.toLocaleLowerCase()) * factor;
      });
    } else if (sortingMode === SortingMode.SIZE_ASCENDING || sortingMode === SortingMode.SIZE_DESCENDING) {
      const factor: number = sortingMode % 2 === 0 ? 1 : -1;
      desktopFiles.sort((a, b) => {
        return (a.size - b.size) * factor;
      });
    }
  }
}