import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Keys
  private readonly DEFAULT_FOLDER_PATH_KEY: string = 'DEFAULT_FOLDER_PATH';
  private readonly SHOW_HIDDEN_KEY: string = 'SHOW_HIDDEN';

  // Default Values
  private readonly DEFAULT_FOLDER_PATH: string = 'C:\\';

  // Persistent data
  private _defaultFolderPath: string;
  private _showHidden: boolean;

  // Getters
  get defaultFolderPath() {
    return this._defaultFolderPath;
  }
  get showHidden() {
    return this._showHidden;
  }

  // Load settings from the local storage
  loadSettings() {
    if (!this._defaultFolderPath) {
      const defaultFolderPath: string = window.localStorage.getItem(this.DEFAULT_FOLDER_PATH_KEY);
      this._defaultFolderPath = defaultFolderPath ? defaultFolderPath : this.DEFAULT_FOLDER_PATH;
    }

    if (!this._showHidden) {
      this._showHidden = window.localStorage.getItem(this.SHOW_HIDDEN_KEY) === 'true';
    }
  }

  // Save settings into the local storage
  saveSettings(defaultFolderPath: string = this.DEFAULT_FOLDER_PATH, showHidden: boolean = false) {
    this._defaultFolderPath = defaultFolderPath;
    window.localStorage.setItem(this.DEFAULT_FOLDER_PATH_KEY, defaultFolderPath);

    this._showHidden = showHidden;
    window.localStorage.setItem(this.SHOW_HIDDEN_KEY, showHidden ? 'true' : 'false');
  }

  // Reset and save settings into the local storage
  resetSettings() {
    this.saveSettings();
  }
}
