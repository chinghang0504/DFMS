import { Injectable } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';
import { SettingsService } from './settings.service';
import { DesktopFilePackage } from '../models/desktop-file-package';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // Persistent data
  private _currentFolderPath: string = "";
  private _allFiles: boolean = false;
  private _desktopFiles: DesktopFile[] = [];

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

  // Update the desktop files
  updateDesktopFiles(desktopFilePackage: DesktopFilePackage) {
    this._folderList = desktopFilePackage.folderList;
    this._fileList = desktopFilePackage.fileList;

    this._desktopFiles = this._folderList
      .concat(this._fileList)
      .filter((desktopFile: DesktopFile) => {
        if (!this.settingsService.showHidden) {
          return !desktopFile.isHidden;
        }

        return true;
      });
  }
}