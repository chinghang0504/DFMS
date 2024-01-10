import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { DesktopFile } from '../../models/desktop-file';
import { DesktopFilePackage } from '../../models/desktop-file-package';
import { ErrorPackage } from '../../models/error-package';
import { OneButtonModalComponent } from '../one-button-modal/one-button-modal.component';
import { SettingsService } from '../../services/settings.service';
import { DesktopCommunicationService } from '../../services/desktop-communication.service';
import { Subscription, finalize } from 'rxjs';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  // UI data
  loading: boolean = true;
  errorMessage: string = "";
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalViewContainerRef: ViewContainerRef;

  // Injection
  constructor(
    public homeService: HomeService,
    private settingsService: SettingsService, private desktopCommunicationService: DesktopCommunicationService,
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
          this.homeService.currentFolderPath ? this.navigateCurrentFolderPath() : this.navigateDefaultFolderPath();
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

  // Navigate the current folder path
  private navigateCurrentFolderPath() {
    this.navigate(this.homeService.currentFolderPath);
  }

  // Navigate the default foler path
  private navigateDefaultFolderPath() {
    this.navigate(this.settingsService.defaultFolderPath);
  }

  // Get a desktop file package
  private getDesktopFilePackage() {
    this.loading = true;
    this.errorMessage = "";
    this.homeService.clearData();

    // Unsubscribe the previous get request
    this._subscription?.unsubscribe();

    this._subscription = this.desktopCommunicationService.getDesktopFilePackage(this.homeService.currentFolderPath, this.homeService.allFiles)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        (res: DesktopFilePackage) => {
          console.log('Receiving a desktop file package...');
          console.log(res);

          this.homeService.updateDesktopFiles(res);
        }, (err) => {
          if (err['status'] === 400) {
            this.errorMessage = (<ErrorPackage>err['error']).message;
          } else {
            this.errorMessage = "Unable to connect to the desktop.";
          }
        }
      );
  }

  // On change the current folder path
  onChangeCurrentFolderPath() {
    this.navigateCurrentFolderPath();
  }

  // On click the parent button
  onClickParentButton() {
    const regExpMatchArray: RegExpMatchArray = this.homeService.currentFolderPath.match(/[\\\/]/g);
    let numOfSplits: number = regExpMatchArray ? regExpMatchArray.length : 0;

    // Only one split
    if (numOfSplits === 1) {
      const lastChar: string = this.homeService.currentFolderPath.slice(-1);

      // The last character is a split
      if (lastChar === "\\" || lastChar === "/") {
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
      if (lastChar === "\\" || lastChar === "/") {
        tempCurrentFolderPath = tempCurrentFolderPath.substring(0, tempCurrentFolderPath.length - 1);
        numOfSplits--;
      }

      const splitIndex: number = Math.max(tempCurrentFolderPath.lastIndexOf('\\'), tempCurrentFolderPath.lastIndexOf('/'));
      this.navigate(tempCurrentFolderPath.substring(0, numOfSplits === 1 ? splitIndex + 1 : splitIndex));
    }
  }

  // On click the default button
  onClickDefaultButton() {
    if (this.homeService.currentFolderPath === this.settingsService.defaultFolderPath) {
      this.homeService.allFiles = false;
      this.getDesktopFilePackage();
    } else {
      this.navigateDefaultFolderPath();
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
    } else {
      this.openFile(desktopFile.absolutePath);
    }
  }

  // On click the open file button
  onClickOpenFileButton(desktopFilePath: string) {
    this.openFile(desktopFilePath);
  }

  // Open the file
  private openFile(desktopFilePath: string) {
    this.desktopCommunicationService.openDesktopFile(desktopFilePath)
      .subscribe(
        (res) => { },
        (err) => {
          OneButtonModalComponent.executeModal(
            this.modalViewContainerRef,
            "System Error", (<ErrorPackage>err['error']).message, "OK"
          );
        }
      );
  }

  // On click delete file button
  onClickDeleteFileButton(desktopFile: DesktopFile) {
    TwoButtonModalComponent.executeModal(
      this.modalViewContainerRef,
      "Delete Confirmation", `Are you sure want to delete ${desktopFile.name}`, "Delete this file", "Cancel",
      () => {
        this.deleteFile(desktopFile.absolutePath);
      }
    );
  }

  // Delete the file
  private deleteFile(desktopFilePath: string) {
    this.desktopCommunicationService.deleteDesktopFile(desktopFilePath)
      .subscribe(
        (res) => {
          this.getDesktopFilePackage();
        },
        (err) => {
          OneButtonModalComponent.executeModal(
            this.modalViewContainerRef,
            "System Error", (<ErrorPackage>err['error']).message, "OK"
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
}