import { Component } from '@angular/core';
import { DesktopFile } from '../../../models/desktop-file';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import { ErrorPackage } from '../../../models/error-package';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrl: './file-details.component.css'
})
export class FileDetailsComponent {

  // UI data
  loading: boolean = true;
  errorMessage: string = '';
  desktopFile: DesktopFile = null;

  // Injection
  constructor(
    private communicationService: CommunicationService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  // On init
  ngOnInit() {
    this.loading = true;
    this.errorMessage = '';
    this.desktopFile = null;

    this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        const queryParamsPath: string =  queryParams['path'];
        if (queryParamsPath) {
          this.loadData(queryParamsPath);
        } else {
          this.errorMessage = 'There is no path to the file or folder. Please back to the file browser.';
          this.loading = false;
        }
      }
    );
  }

  // Load the data
  loadData(path: string) {
    this.loading = true;
    this.errorMessage = '';
    this.desktopFile = null;

    this.communicationService.httpGetDesktopFile(path)
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(
        (res: DesktopFile) => {
          this.desktopFile = res;
        }, (err) => {
          if (err['status'] === 400) {
            this.errorMessage = (<ErrorPackage>err['error']).message;
          } else {
            this.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          }
        }
      );
  }

  // On click the back button
  onClickBackButton() {
    this.router.navigate(['/file-browser']);
  }

  // On click the update button
  onClickUpdateButton() {
    this.updateData();
  }

  // Update the data
  updateData() {
    if (this.desktopFile) {
      this.loadData(this.desktopFile.absolutePath);
    }
  }
}
