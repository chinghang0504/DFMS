import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { HomeService } from '../../services/home.service';
import { DesktopFile } from '../../models/desktop-file';
import { DesktopCommunicationService } from '../../services/desktop-communication.service';
import { DesktopFilePackage } from '../../models/desktop-file-package';
import { ErrorPackage } from '../../models/error-package';
import { OneButtonModalComponent } from '../one-button-modal/one-button-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  // UI Data
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalViewContainerRef: ViewContainerRef;

  // Injection
  constructor(
    public homeService: HomeService,
    private settingsService: SettingsService, private desktopCommunicationService: DesktopCommunicationService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  // On init
  ngOnInit() {
    this.settingsService.loadSettings();

    this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        const queryParamsPath: string = queryParams['path'];

        if (queryParamsPath) {
          this.homeService.currentFolderPath = queryParamsPath;
          this.getDesktopFilePackage();
        } else {
          this.homeService.currentFolderPath ? this.navigate(true) : this.navigate(false);
        }
      });
  }

  // Navigate this page
  navigate(current: boolean) {
    this.router.navigate(['/home'], {
      queryParams: {
        'path': current ? this.homeService.currentFolderPath : this.settingsService.defaultFolderPath
      }
    });
  }

  // Get a desktop file package
  getDesktopFilePackage() {
    this.homeService.loading = true;
    this.homeService.errorMessage = "";

    this.desktopCommunicationService.getDesktopFilePackage(this.homeService.currentFolderPath, this.homeService.allFiles)
      .subscribe(
        (res: DesktopFilePackage) => {
          console.log('Receiving a desktop file package...');
          console.log(res);

          const desktopFilesHashCode: number = res.desktopFilesHashCode;
          if (this.homeService.desktopFilesHashCode != desktopFilesHashCode) {
            this.homeService.desktopFilesHashCode = desktopFilesHashCode;
            this.homeService.desktopFiles = res.desktopFiles;
            this.updateDesktopFiles();
          }

          this.homeService.loading = false;
        }, (err) => {
          if (err['status'] === 400) {
            this.homeService.errorMessage = (<ErrorPackage>err['error']).message;
          } else {
            this.homeService.errorMessage = "Unable to connect to the desktop.";
          }

          this.homeService.loading = false;
        }
      );
  }

  // On change the current folder path
  onChangeCurrentFolderPath() {
    this.navigate(true);
  }

  // On click the parent button
  onClickParentButton() {
    const lastIndex = this.homeService.currentFolderPath.lastIndexOf('\\');
    if (lastIndex !== -1) {
      this.homeService.currentFolderPath = this.homeService.currentFolderPath.substring(0, lastIndex);
      this.homeService.allFiles = false;
      this.navigate(true);
    }
  }

  // On click the default button
  onClickDefaultButton() {
    this.homeService.allFiles = false;

    if (this.homeService.currentFolderPath === this.settingsService.defaultFolderPath) {
      this.getDesktopFilePackage();
    } else {
      this.navigate(false);
    }
  }

  // On click the fresh button
  onClickRefreshButton() {
    this.getDesktopFilePackage();
  }

  // On click the file option
  onClickFileOption(allFiles: boolean) {
    this.homeService.allFiles = allFiles;
    this.getDesktopFilePackage();
  }

  // On click the table row
  onClickTableRow(desktopFile: DesktopFile) {
    if (desktopFile.type === 'folder') {
      this.homeService.currentFolderPath = desktopFile.absolutePath;
      this.navigate(true);
    } else {
      this.openDesktopFile(desktopFile.absolutePath, this.modalViewContainerRef);
    }
  }

  // Open a desktop file
  openDesktopFile(desktopFilePath: string, modalViewContainerRef: ViewContainerRef) {
    this.desktopCommunicationService.openDesktopFile(desktopFilePath)
      .subscribe(
        (res) => { }, (err) => {
          OneButtonModalComponent.executeDyanmicModal(
            modalViewContainerRef,
            "Error Message", (<ErrorPackage>err['error']).message, "OK"
          );
        }
      );
  }

  // Update the desktop files
  updateDesktopFiles() {
    this.homeService.filteredDesktopFiles = this.homeService.desktopFiles.filter(
      (desktopFile: DesktopFile) => {
        if (!this.settingsService.showHidden)
          return !desktopFile.isHidden;

        return true;
      });
  }
}