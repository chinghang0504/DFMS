import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from '../../services/home.service';
import { DesktopFile } from '../../models/desktop-file';
import { DesktopFilePackage } from '../../models/desktop-file-package';
import { ErrorPackage } from '../../models/error-package';
import { SettingsService } from '../../services/settings.service';
import { DesktopCommunicationService } from '../../services/desktop-communication.service';
import { ModalService } from '../../services/modal.service';
import { SearchingTag } from '../../models/searching-tag';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  // Injection
  constructor(
    public homeService: HomeService,
    private settingsService: SettingsService, private desktopCommunicationService: DesktopCommunicationService, private modalService: ModalService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  // Internal data
  private _subscription: Subscription;

  // On init
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        const queryParamsPath: string = queryParams['path'];

        if (queryParamsPath) {
          this.homeService.currentFolderPath = queryParamsPath;
          this.homeService.allFiles = false;
          this.getDesktopFilePackage();
        } else {
          this.homeService.currentFolderPath ? this.navigateCurrentFolder() : this.navigateHomeFolder();
        }
      });
  }

  // Navigate the path
  private navigate(path: string) {
    this.router.navigate(['/home'], {
      queryParams: {
        'path': path
      }
    });
  }

  // Navigate the current folder
  private navigateCurrentFolder() {
    this.navigate(this.homeService.currentFolderPath);
  }

  // Navigate the home folder
  private navigateHomeFolder() {
    this.navigate(this.settingsService.homeFolderPath);
  }

  // Get a desktop file package
  private getDesktopFilePackage() {
    this._subscription?.unsubscribe();

    this.homeService.loading = true;
    this.homeService.errorMessage = '';
    this.homeService.terminateWorker();

    this._subscription = this.desktopCommunicationService.getDesktopFilePackage(this.homeService.currentFolderPath, this.homeService.allFiles)
      .subscribe(
        (res: DesktopFilePackage) => {
          this.homeService.updateDesktopFiles(res);
        }, (err) => {
          if (err['status'] === 400) {
            this.homeService.errorMessage = (<ErrorPackage>err['error']).message;
          } else {
            this.homeService.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          }

          this.homeService.loading = false;
        }
      );
  }

  // On change the current folder path
  onChangeCurrentFolderPath() {
    this.navigateCurrentFolder();
  }

  // On click the parent button
  onClickParentButton() {
    const regExpMatchArray: RegExpMatchArray = this.homeService.currentFolderPath.match(/[\\\/]/g);
    let numOfSplits: number = regExpMatchArray ? regExpMatchArray.length : 0;

    // Only one split
    if (numOfSplits === 1) {
      const lastChar: string = this.homeService.currentFolderPath.slice(-1);

      // The last character is a split
      if (lastChar === '\\' || lastChar === '/') {
        this.homeService.allFiles = false;
        this.getDesktopFilePackage();
      }
      // The last character is not a split
      else {
        const splitIndex: number = Math.max(this.homeService.currentFolderPath.lastIndexOf('\\'), this.homeService.currentFolderPath.lastIndexOf('/'));
        this.navigate(this.homeService.currentFolderPath.substring(0, splitIndex + 1));
      }

      return;
    }

    // More than one splits
    if (numOfSplits > 1) {
      const lastChar: string = this.homeService.currentFolderPath.slice(-1);
      let tempCurrentFolderPath: string = this.homeService.currentFolderPath;

      // The last character is a split 
      if (lastChar === '\\' || lastChar === '/') {
        tempCurrentFolderPath = tempCurrentFolderPath.substring(0, tempCurrentFolderPath.length - 1);
        numOfSplits--;
      }

      const splitIndex: number = Math.max(tempCurrentFolderPath.lastIndexOf('\\'), tempCurrentFolderPath.lastIndexOf('/'));
      this.navigate(tempCurrentFolderPath.substring(0, numOfSplits === 1 ? splitIndex + 1 : splitIndex));
    }
  }

  // On click the home button
  onClickHomeButton() {
    if (this.homeService.currentFolderPath === this.settingsService.homeFolderPath) {
      this.homeService.allFiles = false;
      this.getDesktopFilePackage();
    } else {
      this.navigateHomeFolder();
    }
  }

  // On click the fresh button
  onClickRefreshButton() {
    this.getDesktopFilePackage();
  }

  // On click the file option button
  onClickFileOptionButton(allFiles: boolean) {
    this.homeService.allFiles = allFiles;
    this.getDesktopFilePackage();
  }

  // On click the searching button
  onClickSearchingButton() {
    this.homeService.enableSearching = !this.homeService.enableSearching;
    this.homeService.updateDesktopFiles();
  }

  // On input the searching name
  onInputSearchingName() {
    this.homeService.updateDesktopFiles();
  }

  // On click the table header
  onClickTableHeader(tableHeader: number) {
    this.homeService.sortingMode = this.homeService.sortingMode === tableHeader ? tableHeader + 1 : tableHeader;
    this.homeService.updateDesktopFiles();
  }

  // On click the table element name
  onClickTableElementName(desktopFile: DesktopFile) {
    if (desktopFile.isFolder) {
      this.navigate(desktopFile.absolutePath);
    }
  }

  // On click the open file button
  onClickOpenFileButton(desktopFilePath: string) {
    this.desktopCommunicationService.openDesktopFile(desktopFilePath)
      .subscribe(
        (res) => { },
        (err) => {
          this.modalService.executeOneButtonModal(
            'System Error', (<ErrorPackage>err['error']).message, 'OK'
          );
        }
      );
  }

  // On click delete file button
  onClickDeleteFileButton(desktopFile: DesktopFile) {
    this.modalService.executeTwoButtonModal(
      'Delete Confirmation', `Are you sure want to delete ${desktopFile.name}`, 'Delete', 'Cancel',
      () => {
        this.desktopCommunicationService.deleteDesktopFile(desktopFile.absolutePath)
          .subscribe(
            (res) => {
              this.getDesktopFilePackage();
            },
            (err) => {
              this.modalService.executeOneButtonModal(
                'System Error', (<ErrorPackage>err['error']).message, "OK"
              );
            }
          );
      }
    );
  }

  // On click change the page
  onClickChangePage(left: boolean) {
    if (left) {
      this.homeService.updatePage(this.homeService.currentPageNumber - 1);
    } else {
      this.homeService.updatePage(this.homeService.currentPageNumber + 1);
    }
  }

  // On input change the page
  onInputChangePage() {
    this.homeService.updatePage(this.homeService.currentPageNumber);
  }

  // On click the searching tag button
  onClickSearchingTagButton(searchingTag: SearchingTag) {
    searchingTag.active = !searchingTag.active;
    this.homeService.updateDesktopFiles();
  }

  // On click the tag button
  onClickTagButton(desktopFile: DesktopFile) {
    this.router.navigate(['/home', 'file-details'], {
      queryParams: {
        'path': desktopFile.absolutePath
      }
    });
  }
}