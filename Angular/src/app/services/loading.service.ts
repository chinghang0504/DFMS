import { Injectable, Injector } from '@angular/core';
import { CommunicationService } from './communication.service';
import { SettingsService } from './settings.service';
import { TagsService } from './tags.service';
import { SavingPackage } from '../models/packages/saving.package';
import { Subject, Subscription, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  // Public data
  isLoading: boolean = true;
  isRunning: boolean = false;
  succeededSubject: Subject<void> = new Subject<void>();

  // Private data
  private _subscription: Subscription;

  // Injection
  constructor(private communicationService: CommunicationService, private injector: Injector) { }

  // Init
  init() {
    // It is running
    if (this.isRunning) {
      return;
    }

    // The previous subscription does not closed
    if (this._subscription && !this._subscription.closed) {
      return;
    }

    // Create a new subscription
    this.isLoading = true;
    this._subscription = this.communicationService.httpLoadSaving()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (value: SavingPackage) => {
          this.injector.get(SettingsService).init(value.settingsPackage);
          this.injector.get(TagsService).init(value.tagsPackage);

          this.succeededSubject.complete();

          this.isRunning = true;
        }, error: (err: any) => { }
      });
  }
}
