import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsManagementService {

  private readonly DEFAULT_FOLDER_PATH: string = 'C:\\';
  private readonly DEFAULT_FOLDER_PATH_KEY: string = 'DEFAULT_FOLDER_PATH';
  defaultFolderPath: string;

  private readonly SHOW_HIDDEN_KEY: string = 'SHOW_HIDDEN';
  showHidden: boolean;

  private router: Router = inject(Router);

  loadLocalStorage() {
    if (!this.defaultFolderPath) {
      let defaultFolderPath: string = window.localStorage.getItem(this.DEFAULT_FOLDER_PATH_KEY);
      this.defaultFolderPath = defaultFolderPath ? defaultFolderPath : this.DEFAULT_FOLDER_PATH;
    }

    if (!this.showHidden) {
      this.showHidden = window.localStorage.getItem(this.SHOW_HIDDEN_KEY) === 'true';
    }
  }

  saveLocalStorage(defaultFolderPath: string, showHidden: boolean) {
    this.defaultFolderPath = defaultFolderPath;
    window.localStorage.setItem(this.DEFAULT_FOLDER_PATH_KEY, defaultFolderPath);

    this.showHidden = showHidden;
    window.localStorage.setItem(this.SHOW_HIDDEN_KEY, showHidden ? 'true' : 'false');
  }
}
