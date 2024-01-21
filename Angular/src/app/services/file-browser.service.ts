import { Injectable } from '@angular/core';
import { SortingMode } from '../models/sorting-mode';
import { DesktopFile } from '../models/desktop-file';
import { DesktopFilePackage } from '../models/desktop-file-package';
import { SettingsService } from './settings.service';
import { FileTagsService } from './file-tags.service';
import { FileTag } from '../models/file-tag';

interface WorkerData {
  folderList: DesktopFile[],
  fileList: DesktopFile[],
  showHidden: boolean,
  enableSearching: boolean,
  searchingName: string,
  sortingMode: SortingMode,
  fileTags: FileTag[];
}

@Injectable({
  providedIn: 'root'
})
export class FileBrowserService {

  // UI data
  // File current folder
  currentFolderPath: string = '';
  allFiles: boolean = false;

  // File searching
  enableSearching: boolean = false;
  searchingName: string = '';

  // File table
  loading: boolean = true;
  errorMessage: string = '';
  desktopFiles1000: DesktopFile[] = [];
  sortingMode: SortingMode = SortingMode.NAME_ASCENDING;

  // File table page
  currentPageNumber: number = 1;
  totalPageNumber: number = 1;

  // Internal data
  private _folderList: DesktopFile[] = [];
  private _fileList: DesktopFile[] = [];
  private _desktopFiles: DesktopFile[] = [];
  private _worker: Worker;

  // Injection
  constructor(
    private settingsService: SettingsService, private fileTagsService: FileTagsService
  ) { }

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
    this.terminateWorker();

    if (desktopFilePackage) {
      this._folderList = desktopFilePackage.folderList;
      this._fileList = desktopFilePackage.fileList;
    }

    const workerData: WorkerData = {
      folderList: this._folderList,
      fileList: this._fileList,
      showHidden: this.settingsService.showHidden,
      enableSearching: this.enableSearching,
      searchingName: this.searchingName,
      sortingMode: this.sortingMode,
      fileTags: this.fileTagsService.fileTags
    };

    // Worker
    if (typeof Worker !== 'undefined') {
      this._worker = new Worker(new URL('../workers/file-browser.worker', import.meta.url));

      this._worker.onmessage = ({ data }) => {
        this._desktopFiles = data;
        this.extract1000DesktopFiles();
        this.loading = false;
      };

      this._worker.postMessage(workerData);
    }
    // Non-worker
    else {
      this._desktopFiles = FileBrowserService.filterAndSortDesktopFiles(workerData);
      this.extract1000DesktopFiles();
      this.loading = false;
    }
  }

  // Filter and sort desktop files
  static filterAndSortDesktopFiles(workderData: WorkerData): DesktopFile[] {
    const folderList: DesktopFile[] = FileBrowserService.filterDesktopFiles(workderData.folderList, workderData);
    const fileList: DesktopFile[] = FileBrowserService.filterDesktopFiles(workderData.fileList, workderData);

    FileBrowserService.sortDesktopFiles(folderList, workderData.sortingMode);
    FileBrowserService.sortDesktopFiles(fileList, workderData.sortingMode);

    return folderList.concat(fileList);
  }

  // Filter the desktop files
  static filterDesktopFiles(desktopFiles: DesktopFile[], workderData: WorkerData): DesktopFile[] {
    return desktopFiles.filter(
      (desktopFile: DesktopFile) => {
        // Hidden file
        if (!workderData.showHidden && desktopFile.isHidden) {
          return false;
        }

        if (workderData.enableSearching) {
          // Name
          if (workderData.searchingName && desktopFile.name.toLocaleLowerCase().indexOf(workderData.searchingName.toLocaleLowerCase()) === -1) {
            return false;
          }

          // Tags
          for (const fileTag of workderData.fileTags) {
            if (fileTag.active && desktopFile.tags.indexOf(fileTag.name) === -1) {
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
          return a.type.toLocaleLowerCase().localeCompare(b.type.toLocaleLowerCase()) * factor;
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
      this.currentPageNumber = 1;
      this.totalPageNumber = Math.ceil(this._desktopFiles.length / 1000);
      this.desktopFiles1000 = this._desktopFiles.slice(0, 1000);
    } else {
      this.currentPageNumber = 0;
      this.totalPageNumber = 0;
      this.desktopFiles1000 = [];
    }
  }

  // Update the page
  updatePage(next?: boolean) {
    let pageNumber: number;

    if (next === undefined) {
      pageNumber = this.currentPageNumber;
    } else if (next) {
      pageNumber = this.currentPageNumber + 1;
    } else {
      pageNumber = this.currentPageNumber - 1;
    }

    if (pageNumber < 1) {
      this.currentPageNumber = 1;
    } else if (pageNumber > this.totalPageNumber) {
      this.currentPageNumber = this.totalPageNumber;
    } else {
      this.currentPageNumber = pageNumber;
    }

    const endIndex: number = this.currentPageNumber * 1000;
    this.desktopFiles1000 = this._desktopFiles.slice(endIndex - 1000, endIndex);
  }
}
