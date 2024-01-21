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

  // Parent
  @Input() parent: FileBrowserComponent;

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
    const regExpMatchArray: RegExpMatchArray = this.fileBrowserService.currentFolderPath.match(/[\\\/]/g);
    let numOfSplits: number = regExpMatchArray ? regExpMatchArray.length : 0;

    // Only one split
    if (numOfSplits === 1) {
      const lastChar: string = this.fileBrowserService.currentFolderPath.slice(-1);

      // The last character is a split
      if (lastChar === '\\' || lastChar === '/') {
        this.fileBrowserService.allFiles = false;
        this.parent.getDesktopFilePackage();
      }
      // The last character is not a split
      else {
        const splitIndex: number = Math.max(this.fileBrowserService.currentFolderPath.lastIndexOf('\\'), this.fileBrowserService.currentFolderPath.lastIndexOf('/'));
        this.parent.navigate(this.fileBrowserService.currentFolderPath.substring(0, splitIndex + 1));
      }

      return;
    }

    // More than one splits
    if (numOfSplits > 1) {
      const lastChar: string = this.fileBrowserService.currentFolderPath.slice(-1);
      let tempCurrentFolderPath: string = this.fileBrowserService.currentFolderPath;

      // The last character is a split 
      if (lastChar === '\\' || lastChar === '/') {
        tempCurrentFolderPath = tempCurrentFolderPath.substring(0, tempCurrentFolderPath.length - 1);
        numOfSplits--;
      }

      const splitIndex: number = Math.max(tempCurrentFolderPath.lastIndexOf('\\'), tempCurrentFolderPath.lastIndexOf('/'));
      this.parent.navigate(tempCurrentFolderPath.substring(0, numOfSplits === 1 ? splitIndex + 1 : splitIndex));
    }
  }

  // On click the home button
  onClickHomeButton() {
    if (this.fileBrowserService.currentFolderPath === this.settingsService.homeFolderPath) {
      this.fileBrowserService.allFiles = false;
      this.parent.getDesktopFilePackage();
    } else {
      this.parent.navigateHomeFolder();
    }
  }

  // On click the fresh button
  onClickRefreshButton() {
    this.parent.getDesktopFilePackage();
  }

  // On click the file option button
  onClickFileOptionButton(allFiles: boolean) {
    this.fileBrowserService.allFiles = allFiles;
    this.parent.getDesktopFilePackage();
  }
}
