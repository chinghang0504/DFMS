import { Injectable } from '@angular/core';
import { DesktopFile } from '../models/desktop-file.model';
import { SortingMode } from '../models/sorting-mode.model';
import { Subscription } from 'rxjs';
import { LoadingService } from './loading.service';
import { CommunicationService } from './communication.service';
import { DesktopFilesPackage } from '../models/packages/desktop-files.package';
import { ModalService } from './modal.service';
import { ErrorManager } from '../managers/error.manager';
import { FileTag } from '../models/file-tag.model';
import { SettingsService } from './settings.service';
import { TagsService } from './tags.service';

interface WorkerData {

  folderList: DesktopFile[];
  fileList: DesktopFile[];

  showHidden: boolean;

  enableFilter: boolean;
  filterFileName: string;
  fileterIsFile: boolean;
  fileterIsFolder: boolean;
  fileTags: FileTag[];

  sortingMode: SortingMode;
}

@Injectable({
  providedIn: 'root'
})
export class FileBrowserService {

  // Public data
  // Current folder
  currentFolderPath: string = '';
  allLevels: boolean = false;

  // Filter
  enableFilter: boolean = false;
  filterFileName: string = '';
  fileterIsFile: boolean = true;
  fileterIsFolder: boolean = true;

  // Table
  desktopFilesPortion: DesktopFile[] = [];
  sortingMode: SortingMode = SortingMode.NAME_ASCENDING;

  // Table page
  currentPageNumber: number = 1;
  totalPageNumber: number = 1;

  // Private data
  private _subscription: Subscription;
  private _worker: Worker;
  private _desktopFiles: DesktopFile[] = [];
  private _folderList: DesktopFile[] = [];
  private _fileList: DesktopFile[] = [];

  private readonly _desktopFilesPerPage: number = 100;

  // Injection
  constructor(
    private loadingService: LoadingService, private communicationService: CommunicationService,
    private modalService: ModalService, private settingsService: SettingsService, private tagsService: TagsService) { }

  // Getters
  get resultSize() {
    return this._desktopFiles.length;
  }

  // Get the desktop files
  getDesktopFiles() {
    this._subscription?.unsubscribe();
    this._worker?.terminate();

    this.loadingService.isLoading = true;
    
    this._subscription = this.communicationService.httpGetDesktopFiles(this.currentFolderPath, this.allLevels)
      .subscribe({
        next: (value: DesktopFilesPackage) => {
          this.updateDesktopFiles(value);
        },
        error: (err: any) => {
          this.loadingService.isLoading = false;
          ErrorManager.handleError(err, this.modalService, this.loadingService);
        }
      });
  }

  // Update the desktop files
  updateDesktopFiles(desktopFilePackage?: DesktopFilesPackage) {
    this._worker?.terminate();

    this.loadingService.isLoading = true;

    if (desktopFilePackage) {
      this._folderList = desktopFilePackage.folderList;
      this._fileList = desktopFilePackage.fileList;
    }

    const workerData: WorkerData = {
      fileList: this._fileList,
      folderList: this._folderList,

      showHidden: this.settingsService.originalSettingsPackage.showHidden,

      enableFilter: this.enableFilter,
      filterFileName: this.filterFileName,
      fileterIsFile: this.fileterIsFile,
      fileterIsFolder: this.fileterIsFolder,
      fileTags: this.tagsService.fileTags,

      sortingMode: this.sortingMode 
    };

    // Worker
    if (typeof Worker !== 'undefined') {
      this._worker = new Worker(new URL('../workers/file-browser.worker', import.meta.url));

      this._worker.onmessage = ({ data }) => {
        this._desktopFiles = data;
        this.extractDesktopFilesPortion();
        if (this._subscription?.closed) {
          this.loadingService.isLoading = false;
        }
      };

      this._worker.postMessage(workerData);
    }
    // Non-worker
    else {
      this._desktopFiles = FileBrowserService.filterAndSortDesktopFiles(workerData);
      this.extractDesktopFilesPortion();
      if (this._subscription?.closed) {
        this.loadingService.isLoading = false;
      }
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

        // Filter
        if (workderData.enableFilter) {
          // Is file
          if (!workderData.fileterIsFile && !desktopFile.isFolder) {
            return false;
          }

          // Is folder
          if (!workderData.fileterIsFolder && desktopFile.isFolder) {
            return false;
          }

          // Name
          if (workderData.filterFileName && desktopFile.name.toLocaleLowerCase().indexOf(workderData.filterFileName.toLocaleLowerCase()) === -1) {
            return false;
          }

          // Tags
          for (const fileTag of workderData.fileTags) {
            if (fileTag.active && desktopFile.tags.indexOf(fileTag.tag) === -1) {
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

  // Extract desktop files portion
  extractDesktopFilesPortion() {
    if (this._desktopFiles.length > 0) {
      this.currentPageNumber = 1;
      this.totalPageNumber = Math.ceil(this._desktopFiles.length / this._desktopFilesPerPage);
      this.desktopFilesPortion = this._desktopFiles.slice(0, this._desktopFilesPerPage);
    } else {
      this.currentPageNumber = 0;
      this.totalPageNumber = 0;
      this.desktopFilesPortion = [];
    }
  }

  // Update the page
  updatePage(changeNumber?: number) {
    const pageNumber: number = changeNumber ? this.currentPageNumber + changeNumber : this.currentPageNumber;

    if (pageNumber < 1) {
      this.currentPageNumber = 1;
    } else if (pageNumber > this.totalPageNumber) {
      this.currentPageNumber = this.totalPageNumber;
    } else {
      this.currentPageNumber = pageNumber;
    }

    const endIndex: number = this.currentPageNumber * this._desktopFilesPerPage;
    this.desktopFilesPortion = this._desktopFiles.slice(endIndex - this._desktopFilesPerPage, endIndex);
  }
}
