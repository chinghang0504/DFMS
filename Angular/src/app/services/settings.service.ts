import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Keys
  private readonly HOME_FOLDER_PATH_KEY: string = 'HOME_FOLDER_PATH';
  private readonly SHOW_HIDDEN_KEY: string = 'SHOW_HIDDEN';
  private readonly REMOVE_DOUBLE_CONFIRMATION_KEY: string = 'REMOVE_DOUBLE_CONFIRMATION';

  // Default values
  private readonly DEFAULT_HOME_FOLDER_PATH: string = 'C:\\';
  private readonly DEFAULT_SHOW_HIDDEN: boolean = false;
  private readonly DEFAULT_REMOVE_DOUBLE_CONFIRMATION: boolean = true;

  // UI data
  homeFolderPath: string = this.DEFAULT_HOME_FOLDER_PATH;
  showHidden: boolean = this.DEFAULT_SHOW_HIDDEN;
  removeDoubleConfirmation: boolean = this.DEFAULT_REMOVE_DOUBLE_CONFIRMATION;

  // Load settings from the local storage
  loadSettings() {
    const homeFolderPath: string = window.localStorage.getItem(this.HOME_FOLDER_PATH_KEY);
    this.homeFolderPath = homeFolderPath ? homeFolderPath : this.DEFAULT_HOME_FOLDER_PATH;

    const showHiddenString: string = window.localStorage.getItem(this.SHOW_HIDDEN_KEY);
    this.showHidden = showHiddenString ? (showHiddenString === true.toString()) : this.DEFAULT_SHOW_HIDDEN;

    const removeDoubleConfirmation: string = window.localStorage.getItem(this.REMOVE_DOUBLE_CONFIRMATION_KEY);
    this.removeDoubleConfirmation = removeDoubleConfirmation ? (removeDoubleConfirmation === true.toString()) : this.DEFAULT_REMOVE_DOUBLE_CONFIRMATION;
  }

  // Save settings into the local storage
  saveSettings() {
    window.localStorage.setItem(this.HOME_FOLDER_PATH_KEY, this.homeFolderPath);

    window.localStorage.setItem(this.SHOW_HIDDEN_KEY, this.showHidden.toString());
    
    window.localStorage.setItem(this.REMOVE_DOUBLE_CONFIRMATION_KEY, this.removeDoubleConfirmation.toString());
  }

  // Reset settings
  resetSettings() {
    window.localStorage.removeItem(this.HOME_FOLDER_PATH_KEY);
    this.homeFolderPath = this.DEFAULT_HOME_FOLDER_PATH;

    window.localStorage.removeItem(this.SHOW_HIDDEN_KEY);
    this.showHidden = this.DEFAULT_SHOW_HIDDEN;

    window.localStorage.removeItem(this.REMOVE_DOUBLE_CONFIRMATION_KEY);
    this.removeDoubleConfirmation = this.DEFAULT_REMOVE_DOUBLE_CONFIRMATION;
  }
}
