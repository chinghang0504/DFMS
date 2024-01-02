import { Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { TwoButtonModalComponent } from '../two-button-modal/two-button-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  // UI Data
  defaultFolderPath: string;
  showHidden: boolean;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  // Injection
  private settingsService: SettingsService = inject(SettingsService);

  // On Init
  ngOnInit() {
    this.settingsService.loadSettings();
    this.updateUIData();
  }

  // Update the UI data from the settings
  updateUIData() {
    this.defaultFolderPath = this.settingsService.defaultFolderPath;
    this.showHidden = this.settingsService.showHidden;
  }

  // On click the save button
  onClickSave() {
    TwoButtonModalComponent.handleDyanmicModal(
      this.modalContainer,
      "Save Confirmation", "Do you want to save changes?", "Cancel", "Save Confirm",
      () => {
        this.settingsService.saveSettings(this.defaultFolderPath, this.showHidden);
        this.updateUIData(); 
      }
    );
  }

  // On click the reset button
  onClickReset() {
    TwoButtonModalComponent.handleDyanmicModal(
      this.modalContainer,
      "Reset Confirmation", "Do you want to reset to default?", "Cancel", "Reset Confrim",
      () => {
        this.settingsService.resetSettings();
        this.updateUIData();
      }
    );
  }
}
