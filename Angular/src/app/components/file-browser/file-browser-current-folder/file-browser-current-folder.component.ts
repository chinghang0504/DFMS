import { Component, Input } from '@angular/core';
import { FileBrowserService } from '../../../services/file-browser.service';
import { SettingsService } from '../../../services/settings.service';
import { FileBrowserComponent } from '../file-browser/file-browser.component';

@Component({
  selector: 'app-file-browser-current-folder',
  templateUrl: './file-browser-current-folder.component.html',
  styleUrl: './file-browser-current-folder.component.css'
})
export class FileBrowserCurrentFolderComponent {

  // Private data
  @Input()
  private parent: FileBrowserComponent;

  // Injection
  constructor(
    public fileBrowserService: FileBrowserService,
    private settingsService: SettingsService
  ) { }

  // On change the current folder path
  onChangeCurrentFolderPath() {
    this.parent.navigateCurrentFolder();
  }

  // On click the parent button
  onClickParentButton() {
    const currentFolderPath: string = this.fileBrowserService.currentFolderPath;

    // Remove the last char if it is a splitter
    const lastChar: string = currentFolderPath.slice(-1);
    let newCurrentFolderPath: string = (lastChar === '\\' || lastChar === '/') ? currentFolderPath.slice(0, currentFolderPath.length - 1) : currentFolderPath.slice();

    // Extract a string before the last splitter
    const index: number = Math.max(newCurrentFolderPath.lastIndexOf('\\'), newCurrentFolderPath.lastIndexOf('/'));
    if (index !== -1) {
      newCurrentFolderPath = newCurrentFolderPath.slice(0, index);
    }

    // Add a splitter if the string does not have one
    const regExpMatchArray: RegExpMatchArray = newCurrentFolderPath.match(/[\\\/]/g);
    if (!regExpMatchArray) {
      newCurrentFolderPath += '\\';
    }

    // Compare to the original string
    if (newCurrentFolderPath === currentFolderPath) {
      this.fileBrowserService.allLevels = false;
      this.fileBrowserService.getDesktopFiles();
    } else {
      this.parent.navigate(newCurrentFolderPath);
    }
  }

  // On click the home button
  onClickHomeButton() {
    if (this.fileBrowserService.currentFolderPath === this.settingsService.originalSettingsPackage.homeFolderPath) {
      this.fileBrowserService.allLevels = false;
      this.fileBrowserService.getDesktopFiles();
    } else {
      this.parent.navigateHomeFolder();
    }
  }

  // On click the fresh button
  onClickRefreshButton() {
    this.fileBrowserService.getDesktopFiles();
  }

  // On click the level button
  onClickLevelButton() {
    this.fileBrowserService.allLevels = !this.fileBrowserService.allLevels;
    this.fileBrowserService.getDesktopFiles();
  }
}
