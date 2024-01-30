import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { FileBrowserService } from '../../../services/file-browser.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrl: './file-browser.component.css'
})
export class FileBrowserComponent implements OnInit, OnDestroy {

  // Private data
  private _subscription: Subscription;

  // Injection
  constructor(
    public loadingService: LoadingService,
    private fileBrowserService: FileBrowserService, private settingsService: SettingsService,
    private activatedRoute: ActivatedRoute, private router: Router
  ) { }

  // On init
  ngOnInit() {
    this._subscription = this.loadingService.succeededSubject
      .pipe(
        take(1)
      )
      .subscribe({
        complete: () => {
          this.subscribeQueryParams();
        }
      });
  }

  // On destroy
  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }

  // Subscribe the query params
  private subscribeQueryParams() {
    this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        const paramsPath: string = params['path'];

        if (paramsPath) {
          this.fileBrowserService.currentFolderPath = paramsPath;
          this.fileBrowserService.allLevels = false;
          this.fileBrowserService.getDesktopFiles();
        } else {
          this.fileBrowserService.currentFolderPath ? this.navigateCurrentFolder() : this.navigateHomeFolder();
        }
      });
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
    this.navigate(this.settingsService.originalSettingsPackage.homeFolderPath);
  }

  // Navigate the file details
  navigateFileDetails(path: string) {
    this.router.navigate(['/file-browser', 'file-details'], {
      queryParams: {
        'path': path
      }
    });
  }
}
