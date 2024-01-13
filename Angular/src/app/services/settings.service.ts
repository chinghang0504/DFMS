import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Keys and values
  private readonly HOME_FOLDER_PATH_KEY: string = 'HOME_FOLDER_PATH';
  private readonly SHOW_HIDDEN_KEY: string = 'SHOW_HIDDEN';
  private readonly DEFAULT_HOME_FOLDER_PATH: string = 'C:\\';

  // Internal data
  private _homeFolderPath: string = '';
  private _showHidden: boolean = false;

  // Getters
  get homeFolderPath() {
    return this._homeFolderPath;
  }
  get showHidden() {
    return this._showHidden;
  }

  // Load settings from the local storage
  loadSettings() {
    const homeFolderPath: string = window.localStorage.getItem(this.HOME_FOLDER_PATH_KEY);
    this._homeFolderPath = homeFolderPath ? homeFolderPath : this.DEFAULT_HOME_FOLDER_PATH;

    this._showHidden = window.localStorage.getItem(this.SHOW_HIDDEN_KEY) === 'true';
  }

  // Save settings into the local storage
  saveSettings(homeFolderPath: string, showHidden: boolean) {
    window.localStorage.setItem(this.HOME_FOLDER_PATH_KEY, homeFolderPath);
    this._homeFolderPath = homeFolderPath;

    window.localStorage.setItem(this.SHOW_HIDDEN_KEY, showHidden ? 'true' : 'false');
    this._showHidden = showHidden;
  }

  // Reset settings
  resetSettings() {
    this.saveSettings(this.DEFAULT_HOME_FOLDER_PATH, false);
  }
}