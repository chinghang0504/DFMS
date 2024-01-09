import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  // UI Data
  defaultFolderPath: string = "";
  showHidden: boolean = false;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalViewContainerRef: ViewContainerRef;

  // Injection
  constructor(private settingsService: SettingsService) { }

  // On init
  ngOnInit() {
    this.updateUIData();
  }

  // Update the UI data from the settings
  updateUIData() {
    this.defaultFolderPath = this.settingsService.defaultFolderPath;
    this.showHidden = this.settingsService.showHidden;
  }

  // On click the save button
  onClickSave() {
    TwoButtonModalComponent.executeModal(
      this.modalViewContainerRef,
      "Save Confirmation", "Do you want to save changes?", "Save changes", "Cancel",
      () => {
        this.settingsService.saveSettings(this.defaultFolderPath, this.showHidden);
        this.updateUIData();
      }
    );
  }

  // On click the reset button
  onClickReset() {
    TwoButtonModalComponent.executeModal(
      this.modalViewContainerRef,
      "Reset Confirmation", "Do you want to reset to default?", "Reset to default", "Cancel",
      () => {
        this.settingsService.resetSettings();
        this.updateUIData();
      }
    );
  }
}
