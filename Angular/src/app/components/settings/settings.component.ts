import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  // UI data
  homeFolderPath: string = '';
  showHidden: boolean = false;

  // Injection
  constructor(
    private settingsService: SettingsService, private modalService: ModalService
  ) { }

  // On init
  ngOnInit() {
    this.updateUIData();
  }

  // Update the UI data from the settings
  private updateUIData() {
    this.homeFolderPath = this.settingsService.homeFolderPath;
    this.showHidden = this.settingsService.showHidden;
  }

  // Is not changed
  isNotChanged(): boolean {
    return this.homeFolderPath === this.settingsService.homeFolderPath && this.showHidden === this.settingsService.showHidden;
  }

  // On click the save button
  onClickSaveButton() {
    this.modalService.executeTwoButtonModal(
      'Save Confirmation', 'Do you want to save changes?', 'Save', 'Cancel',
      () => {
        this.settingsService.saveSettings(this.homeFolderPath, this.showHidden);
      }
    );
  }

  // On click the reset button
  onClickResetButton() {
    this.modalService.executeTwoButtonModal(
      'Reset Confirmation', 'Do you want to reset to default?', 'Reset', 'Cancel',
      () => {
        this.settingsService.resetSettings();
        this.updateUIData();
      }
    );
  }
}
