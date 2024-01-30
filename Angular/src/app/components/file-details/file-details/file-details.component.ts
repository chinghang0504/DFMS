import { Component, OnDestroy, OnInit } from '@angular/core';
import { DesktopFile } from '../../../models/desktop-file.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import { Subscription, finalize, take } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { DesktopFilePackage } from '../../../models/packages/desktop-file.package';
import { ModalService } from '../../../services/modal.service';
import { ErrorManager } from '../../../managers/error.manager';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrl: './file-details.component.css'
})
export class FileDetailsComponent implements OnInit, OnDestroy {

  // Public data
  desktopFile: DesktopFile = null;
  errorMessage: string = '';

  // Private data
  private _subscription: Subscription;

  // Injection
  constructor(
    public loadingService: LoadingService,
    private communicationService: CommunicationService, private modalService: ModalService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

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
  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  // Subscribe the query params
  private subscribeQueryParams() {
    this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        const paramsPath: string = params['path'];

        if (paramsPath) {
          this.loadData(paramsPath);
        } else {
          this.router.navigate(['/file-browser']);
        }
      });
  }

  // Load the data
  loadData(path: string) {
    this.loadingService.isLoading = true;
    this.errorMessage = '';
    this.desktopFile = null;

    this.communicationService.httpGetDesktopFile(path)
      .pipe(
        finalize(() => {
          this.loadingService.isLoading = false;
        })
      ).subscribe({
        next: (value: DesktopFilePackage) => {
          this.desktopFile = value.desktopFile;
        },
        error: (err: any) => {
          ErrorManager.handleError(err, this.modalService, this.loadingService);
        }
      });
  }

  // On click the back button
  onClickBackButton() {
    this.router.navigate(['/file-browser']);
  }

  // On click the update button
  onClickUpdateButton() {
    this.updateData();
  }

  updateData() {
    const path: string = this.activatedRoute.snapshot.queryParams['path'];
    if (path) {
      this.loadData(path);
    } else {
      this.router.navigate(['/file-browser']);
    }
  }
}
