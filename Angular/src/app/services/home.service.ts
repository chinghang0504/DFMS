import { Injectable } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // Persistent data
  private _currentFolderPath: string;
  private _allFiles: boolean = false;
  private _loading: boolean;
  private _errorMessage: string;
  private _filteredDesktopFiles: DesktopFile[];

  // Package Data
  private _desktopFilesHashCode: number;
  private _desktopFiles: DesktopFile[];

  // Injection
  constructor() { }

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
  get loading() {
    return this._loading;
  }
  set loading(value) {
    this._loading = value;
  }
  get errorMessage() {
    return this._errorMessage;
  }
  set errorMessage(value) {
    this._errorMessage = value;
  }
  get filteredDesktopFiles() {
    return this._filteredDesktopFiles;
  }
  set filteredDesktopFiles(value) {
    this._filteredDesktopFiles = value;
  }
  get desktopFilesHashCode() {
    return this._desktopFilesHashCode;
  }
  set desktopFilesHashCode(value) {
    this._desktopFilesHashCode = value;
  }
  get desktopFiles() {
    return this._desktopFiles;
  }
  set desktopFiles(value) {
    this._desktopFiles = value;
  }
}