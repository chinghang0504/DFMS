import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsManagementService {

  private readonly DEFAULT_FOLDER_PATH: string = 'C:\\';
  private readonly DEFAULT_FOLDER_PATH_KEY: string = 'DEFAULT_FOLDER_PATH';
  defaultFolderPath: string;

  loadDefaultFolderPath() {
    if (!this.defaultFolderPath) {
      let defaultFolderPath: string = window.localStorage.getItem(this.DEFAULT_FOLDER_PATH_KEY);
      this.defaultFolderPath = defaultFolderPath ? defaultFolderPath : this.DEFAULT_FOLDER_PATH;
    }
  }

  saveDefaultFolderPath() {
    window.localStorage.setItem(this.DEFAULT_FOLDER_PATH_KEY, this.defaultFolderPath);
  }
}
