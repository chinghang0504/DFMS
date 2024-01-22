import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';
import { finalize } from 'rxjs';
import { SettingsPackage } from '../models/settings-package';
import { ErrorPackage } from '../models/error-package';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Keys
  private readonly HOME_FOLDER_PATH_KEY: string = 'HOME_FOLDER_PATH';
  private readonly SHOW_HIDDEN_KEY: string = 'SHOW_HIDDEN';
  private readonly REMOVE_DOUBLE_CONFIRMATION_KEY: string = 'REMOVE_DOUBLE_CONFIRMATION';

  // Default values
  private readonly DEFAULT_HOME_FOLDER_PATH: string = 'C:\\';
  private readonly DEFAULT_SHOW_HIDDEN: boolean = false;
  private readonly DEFAULT_REMOVE_DOUBLE_CONFIRMATION: boolean = true;

  // UI data
  loading: boolean = true;
  errorMessage: string = '';
  homeFolderPath: string = this.DEFAULT_HOME_FOLDER_PATH;
  showHidden: boolean = this.DEFAULT_SHOW_HIDDEN;
  removeDoubleConfirmation: boolean = this.DEFAULT_REMOVE_DOUBLE_CONFIRMATION;

  // Injection
  constructor(
    private communicationService: CommunicationService, private modalService: ModalService
  ) { }

  // Load settings from the local storage
  loadSettings() {
    this.communicationService.httpLoadSettings()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        (res: SettingsService) => {
          this.homeFolderPath = res.homeFolderPath;
          this.showHidden = res.showHidden;
          this.removeDoubleConfirmation = res.removeDoubleConfirmation;
        }, (err) => {
          this.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
        }
      );
  }

  // Save settings into the local storage
  saveSettings() {
    this.loading = true;
    this.errorMessage = '';

    const settingsPackage: SettingsPackage = {
      'homeFolderPath': this.homeFolderPath,
      'showHidden': this.showHidden,
      'removeDoubleConfirmation': this.removeDoubleConfirmation
    };

    this.communicationService.httpSaveSettings(settingsPackage)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        (res) => { },
        (err) => {
          let errorMessage: string;

          if (err['status'] === 400) {
            errorMessage = (<ErrorPackage>err['error']).message;
          } else {
            errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          }

          this.modalService.executeOneButtonModal(
            'Error', errorMessage, 'OK'
          );
        }
      );
  }

  // Reset settings
  resetSettings() {
    this.loading = true;
    this.errorMessage = '';

    this.communicationService.httpSaveSettings()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        (res: SettingsService) => {
          this.homeFolderPath = res.homeFolderPath;
          this.showHidden = res.showHidden;
          this.removeDoubleConfirmation = res.removeDoubleConfirmation;
        }, (err) => {
          if (err['status'] === 400) {
            this.errorMessage = (<ErrorPackage>err['error']).message;
          } else {
            this.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          }
        }
      )
  }
}
