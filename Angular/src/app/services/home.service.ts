import { Injectable } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';
import { SettingsService } from './settings.service';
import { DesktopFilePackage } from '../models/desktop-file-package';
import { SortingMode } from '../models/sorting-mode';
import { SearchingTag } from '../models/searching-tag';

interface WorkerData {
  folderList: DesktopFile[],
  fileList: DesktopFile[],
  showHidden: boolean,
  enableSearching: boolean,
  searchingName: string,
  sortingMode: SortingMode,
  searchingTags: SearchingTag[];
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // UI data
  loading: boolean = true;
  errorMessage: string = '';
  currentFolderPath: string = '';
  allFiles: boolean = false;
  enableSearching: boolean = false;
  searchingName: string = '';
  sortingMode: SortingMode = SortingMode.NAME_ASCENDING;
  desktopFiles1000: DesktopFile[] = [];
  currentPageNumber: number = 1;
  totalPageNumber: number = 1;
  searchingTags: SearchingTag[] = [];

  // Internal data
  private _folderList: DesktopFile[] = [];
  private _fileList: DesktopFile[] = [];
  private _desktopFiles: DesktopFile[] = [];
  private _worker: Worker;

  // Injection
  constructor(private settingsService: SettingsService) { }

  // Getters
  get size() {
    return this._desktopFiles.length;
  }

  // Terminate worker
  terminateWorker() {
    this._worker?.terminate();
  }

  // Update the desktop files
  updateDesktopFiles(desktopFilePackage?: DesktopFilePackage) {
    if (desktopFilePackage) {
      this._folderList = desktopFilePackage.folderList;
      this._fileList = desktopFilePackage.fileList;
    }

    this.terminateWorker();

    const workerData: WorkerData = {
      folderList: this._folderList,
      fileList: this._fileList,
      showHidden: this.settingsService.showHidden,
      enableSearching: this.enableSearching,
      searchingName: this.searchingName,
      sortingMode: this.sortingMode,
      searchingTags: this.searchingTags
    };

    // Worker
    if (typeof Worker !== 'undefined') {
      this._worker = new Worker(new URL('../workers/home.worker', import.meta.url));

      this._worker.onmessage = ({ data }) => {
        this._desktopFiles = data;
        this.extract1000DesktopFiles();
        this.loading = false;
      };

      this._worker.postMessage(workerData);
    }
    // Non-worker
    else {
      this._desktopFiles = HomeService.filterAndSortDesktopFiles(workerData);
      this.extract1000DesktopFiles();
      this.loading = false;
    }
  }

  // Filter and sort desktop files
  static filterAndSortDesktopFiles(workderData: WorkerData): DesktopFile[] {
    const tempFolderList: DesktopFile[] = HomeService.filterDesktopFiles(workderData.folderList, workderData.showHidden, workderData.enableSearching, workderData.searchingName, workderData.searchingTags);
    const tempFileList: DesktopFile[] = HomeService.filterDesktopFiles(workderData.fileList, workderData.showHidden, workderData.enableSearching, workderData.searchingName, workderData.searchingTags);

    HomeService.sortDesktopFiles(tempFolderList, workderData.sortingMode);
    HomeService.sortDesktopFiles(tempFileList, workderData.sortingMode);

    return tempFolderList.concat(tempFileList);
  }

  // Filter the desktop files
  static filterDesktopFiles(desktopFiles: DesktopFile[], showHidden: boolean, enableSearching: boolean, searchingInput: string, searchingTags: SearchingTag[]): DesktopFile[] {
    return desktopFiles.filter(
      (desktopFile: DesktopFile) => {
        // Hidden file
        if (!showHidden && desktopFile.isHidden) {
          return false;
        }

        if (enableSearching) {
          // Name
          if (searchingInput && desktopFile.name.toLocaleLowerCase().indexOf(searchingInput.toLocaleLowerCase()) === -1) {
            return false;
          }

          // Tags
          for (const searchingTag of searchingTags) {
            if (searchingTag.active && desktopFile.tags.indexOf(searchingTag.name) === -1) {
              return false;
            }
          }
        }

        return true;
      }
    );
  }

  // Sort the desktop files
  static sortDesktopFiles(desktopFiles: DesktopFile[], sortingMode: SortingMode) {
    const factor: number = sortingMode % 2 === 0 ? 1 : -1;

    switch (sortingMode) {
      case SortingMode.NAME_ASCENDING:
      case SortingMode.NAME_DESCENDING:
        desktopFiles.sort((a, b) => {
          return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()) * factor;
        });
        break;
      case SortingMode.LAST_MODIFIED_ASCENDING:
      case SortingMode.LAST_MODIFIED_DESCENDING:
        desktopFiles.sort((a, b) => {
          return (a.lastModified - b.lastModified) * factor;
        });
        break;
      case SortingMode.TYPE_ASCENDING:
      case SortingMode.TYPE_DESCENDING:
        desktopFiles.sort((a, b) => {
          return a.extension.toLocaleLowerCase().localeCompare(b.extension.toLocaleLowerCase()) * factor;
        });
        break;
      case SortingMode.SIZE_ASCENDING:
      case SortingMode.SIZE_DESCENDING:
        desktopFiles.sort((a, b) => {
          return (a.size - b.size) * factor;
        });
        break;
    }
  }

  // Extract 1000 desktop files
  extract1000DesktopFiles() {
    if (this._desktopFiles.length > 0) {
      this.totalPageNumber = Math.ceil(this._desktopFiles.length / 1000);
      this.currentPageNumber = 1;
      this.desktopFiles1000 = this._desktopFiles.slice(0, 1000);
    } else {
      this.totalPageNumber = 0;
      this.currentPageNumber = 0;
      this.desktopFiles1000 = [];
    }
  }

  // Update the page
  updatePage(pageNumber: number) {
    if (pageNumber < 1) {
      this.currentPageNumber = 1;
    } else if (pageNumber > this.totalPageNumber) {
      this.currentPageNumber = this.totalPageNumber;
    } else {
      this.currentPageNumber = pageNumber;
    }

    const startIndex: number = (this.currentPageNumber - 1) * 1000;
    const endIndex: number = this.currentPageNumber * 1000;
    this.desktopFiles1000 = this._desktopFiles.slice(startIndex, endIndex);
  }
}