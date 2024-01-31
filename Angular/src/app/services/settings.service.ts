import { Injectable } from '@angular/core';
import { SettingsPackage } from '../models/packages/settings.package';
import { CommunicationService } from './communication.service';
import { ModalService } from './modal.service';
import { ErrorManager } from '../managers/error.manager';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Public data
  settingsPackage: SettingsPackage;

  // Private data
  private _originalSettingsPackage: SettingsPackage;

  // Injection
  constructor(private loadingService: LoadingService, private communicationService: CommunicationService, private modalService: ModalService) { }

  // Getters
  get originalSettingsPackage() {
    return this._originalSettingsPackage;
  }

  // Init
  init(settingsPackage: SettingsPackage) {
    this._originalSettingsPackage = settingsPackage;
    this.settingsPackage = { ...this._originalSettingsPackage };
  }

  // Save the settings
  saveSettings(reset: boolean) {
    const settingsPackage: SettingsPackage = reset ? undefined : this.settingsPackage;

    this.loadingService.isLoading = true;

    this.communicationService.httpSaveSettings(settingsPackage)
      .pipe(
        finalize(() => {
          this.loadingService.isLoading = false;
        })
      )
      .subscribe({
        next: (value: SettingsPackage) => {
          this._originalSettingsPackage = value;
          this.settingsPackage = { ...this._originalSettingsPackage };
        },
        error: (err: any) => {
          this.settingsPackage = { ...this._originalSettingsPackage };

          console.log(err);

          ErrorManager.handleError(err, this.modalService, this.loadingService);
        }
      });
  }
}
