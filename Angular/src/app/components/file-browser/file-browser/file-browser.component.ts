import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileBrowserService } from '../../../services/file-browser.service';
import { SettingsService } from '../../../services/settings.service';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../../services/communication.service';
import { DesktopFilePackage } from '../../../models/desktop-file-package';
import { ErrorPackage } from '../../../models/error-package';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrl: './file-browser.component.css'
})
export class FileBrowserComponent implements OnInit, OnDestroy {

  // Internal data
  private _subscription: Subscription;

  // Injection
  constructor(
    public fileBrowserService: FileBrowserService,
    private settingsService: SettingsService, private communicationService: CommunicationService,
    private activatedRoute: ActivatedRoute, private router: Router
  ) { }

  // On init
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        const queryParamsPath: string = queryParams['path'];

        if (queryParamsPath) {
          this.fileBrowserService.currentFolderPath = queryParamsPath;
          this.fileBrowserService.allFiles = false;
          this.getDesktopFilePackage();
        } else {
          this.fileBrowserService.currentFolderPath ? this.navigateCurrentFolder() : this.navigateHomeFolder();
        }
      });
  }

  // On destroy
  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }

  // Navigate the path
  navigate(path: string) {
    this.router.navigate(['/file-browser'], {
      queryParams: {
        'path': path
      }
    });
  }

  // Navigate the current folder
  navigateCurrentFolder() {
    this.navigate(this.fileBrowserService.currentFolderPath);
  }

  // Navigate the home folder
  navigateHomeFolder() {
    this.navigate(this.settingsService.homeFolderPath);
  }

  // Navigate the file details
  navigateFileDetails(path: string) {
    this.router.navigate(['/file-browser', 'file-details'], {
      queryParams: {
        'path': path
      }
    });
  }

  // Get a desktop file package
  getDesktopFilePackage() {
    this._subscription?.unsubscribe();

    this.fileBrowserService.loading = true;
    this.fileBrowserService.errorMessage = '';
    this.fileBrowserService.terminateWorker();

    this._subscription = this.communicationService.httpGetDesktopFilePackage(this.fileBrowserService.currentFolderPath, this.fileBrowserService.allFiles)
      .subscribe(
        (res: DesktopFilePackage) => {
          this.fileBrowserService.updateDesktopFiles(res);
        }, (err) => {
          if (err['status'] === 400) {
            this.fileBrowserService.errorMessage = (<ErrorPackage>err['error']).message;
          } else {
            this.fileBrowserService.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          }

          this.fileBrowserService.loading = false;
        }
      );
  }
}
