import { Injectable } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';
import { SettingsService } from './settings.service';
import { DesktopFilePackage } from '../models/desktop-file-package';
import { SortingMode } from '../models/sorting-mode';

interface WorkerData {
  folderList: DesktopFile[], 
  fileList: DesktopFile[], 
  showHidden: boolean, 
  enableSearching: boolean, 
  searchingName: string, 
  sortingMode: SortingMode
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // UI data
  currentFolderPath: string = "";
  allFiles: boolean = false;
  enableSearching: boolean = false;
  searchingName: string = "";
  sortingMode: SortingMode = SortingMode.NAME_ASCENDING;
  desktopFiles1000: DesktopFile[] = [];

  // Internal data
  private _folderList: DesktopFile[];
  private _fileList: DesktopFile[];
  private _desktopFiles: DesktopFile[];
  private _worker: Worker;

  // Injection
  constructor(private settingsService: SettingsService) { }

  // Clear data
  clearData() {
    this.desktopFiles1000 = [];
    this._folderList = [];
    this._fileList = [];
    this._desktopFiles = [];
    this._worker?.terminate();
  }

  // Update the desktop files
  updateDesktopFiles(desktopFilePackage?: DesktopFilePackage) {
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
      sortingMode: this.sortingMode
    };

    // Worker
    if (typeof Worker !== 'undefined') {
      this._worker = new Worker(new URL('../workers/home.worker', import.meta.url));

      this._worker.onmessage = ({ data }) => {
        this._desktopFiles = data;
        this.desktopFiles1000 = this._desktopFiles.slice(0, 1000);
      };

      this._worker.postMessage(workerData);
    }
    // Non-workder
    else {
      this._desktopFiles = HomeService.filterAndSortDesktopFiles(workerData);
      this.desktopFiles1000 = this._desktopFiles.slice(0, 1000);
    }
  }

  // Filter and sort desktop files
  static filterAndSortDesktopFiles(workderData: WorkerData): DesktopFile[] {
    const tempFolderList: DesktopFile[] = HomeService.filterDesktopFiles(workderData.folderList, workderData.showHidden, workderData.enableSearching, workderData.searchingName);
    const tempFileList: DesktopFile[] = HomeService.filterDesktopFiles(workderData.fileList, workderData.showHidden, workderData.enableSearching, workderData.searchingName);

    HomeService.sortDesktopFiles(tempFolderList, workderData.sortingMode);
    HomeService.sortDesktopFiles(tempFileList, workderData.sortingMode);

    return tempFolderList.concat(tempFileList);
  }

  // Filter the desktop files
  static filterDesktopFiles(desktopFiles: DesktopFile[], showHidden: boolean, enableSearching: boolean, searchingInput: string): DesktopFile[] {
    return desktopFiles.filter(
      (desktopFile: DesktopFile) => {
        // Hidden file
        if (!showHidden && desktopFile.isHidden) {
          return false;
        }

        // Searching name
        if (enableSearching && searchingInput) {
          return desktopFile.name.toLocaleLowerCase().indexOf(searchingInput.toLocaleLowerCase()) != -1;
        }

        return true;
      }
    );
  }

  // Sort the desktop files
  static sortDesktopFiles(desktopFiles: DesktopFile[], sortingMode: SortingMode) {
    const factor: number = sortingMode % 2 === 0 ? 1 : -1;

    // Name
    if (sortingMode === SortingMode.NAME_ASCENDING || sortingMode === SortingMode.NAME_DESCENDING) {
      desktopFiles.sort((a, b) => {
        return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()) * factor;
      });
    }
    // Last modified
    else if (sortingMode === SortingMode.LAST_MODIFIED_ASCENDING || sortingMode === SortingMode.LAST_MODIFIED_DESCENDING) {
      desktopFiles.sort((a, b) => {
        return (a.lastModified - b.lastModified) * factor;
      });
    }
    // Type
    else if (sortingMode === SortingMode.TYPE_ASCENDING || sortingMode === SortingMode.TYPE_DESCENDING) {
      desktopFiles.sort((a, b) => {
        return a.extension.toLocaleLowerCase().localeCompare(b.extension.toLocaleLowerCase()) * factor;
      });
    }
    // Size
    else if (sortingMode === SortingMode.SIZE_ASCENDING || sortingMode === SortingMode.SIZE_DESCENDING) {
      desktopFiles.sort((a, b) => {
        return (a.size - b.size) * factor;
      });
    }
  }
}