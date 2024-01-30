import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ModalService } from '../../services/modal.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  // Injection
  constructor(
    public loadingService: LoadingService, public settingsService: SettingsService,
    private modalService: ModalService
  ) { }

  // On change the settings
  onChangeSettings() {
    this.settingsService.saveSettings(false);
  }

  // On click the reset button
  onClickResetButton() {
    this.modalService.executeTwoButtonModal(
      'Settings Reset Confirmation', 'Do you want to reset to default?', 'Reset', 'Cancel',
      () => {
        this.settingsService.saveSettings(true);
      }
    );
  }
}
