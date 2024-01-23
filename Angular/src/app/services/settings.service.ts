import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';
import { SettingsPackage } from '../packages/settings-package';
import { ErrorPackage } from '../packages/error-package';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // UI data
  homeFolderPath: string;
  showHidden: boolean;
  removeDoubleConfirmation: boolean;

  // Injection
  constructor(
    private communicationService: CommunicationService, private modalService: ModalService
  ) { }

  // Save settings into the local storage
  saveSettings() {
    const settingsPackage: SettingsPackage = {
      'homeFolderPath': this.homeFolderPath,
      'showHidden': this.showHidden,
      'removeDoubleConfirmation': this.removeDoubleConfirmation,
    };

    this.communicationService.httpSaveSettings(settingsPackage)
      .subscribe(
        (res: SettingsPackage) => {
          this.homeFolderPath = res.homeFolderPath;
          this.showHidden = res.showHidden;
          this.removeDoubleConfirmation = res.removeDoubleConfirmation;
        },
        (err) => {
          const errorMessage: string = err['status'] === 400 ? (<ErrorPackage>err['error']).message : 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          this.modalService.executeOneButtonModal(
            'Error', errorMessage, 'OK'
          );
        }
      );
  }

  // Reset settings
  resetSettings() {
    this.communicationService.httpSaveSettings()
      .subscribe(
        (res: SettingsPackage) => {
          this.homeFolderPath = res.homeFolderPath;
          this.showHidden = res.showHidden;
          this.removeDoubleConfirmation = res.removeDoubleConfirmation;
        },
        (err) => {
          const errorMessage: string = err['status'] === 400 ? (<ErrorPackage>err['error']).message : 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
          this.modalService.executeOneButtonModal(
            'Error', errorMessage, 'OK'
          );
        }
      );
  }
}
