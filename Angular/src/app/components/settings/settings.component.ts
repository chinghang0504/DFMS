import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  // Injection
  constructor(
    public settingsService: SettingsService,
    private modalService: ModalService
  ) { }

  // On click the reset button
  onClickResetButton() {
    this.modalService.executeTwoButtonModal(
      'Reset Confirmation', 'Do you want to reset to default?', 'Reset', 'Cancel',
      () => {
        this.settingsService.resetSettings();
      }
    );
  }

  // On change any inputs
  onChangeAnyInputs() {
    this.settingsService.saveSettings();
  }
}
