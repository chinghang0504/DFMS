import { Component, inject } from '@angular/core';
import { SettingsManagementService } from '../../services/settings-management.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  defaultFolderPath: string;
  showHidden: boolean;

  public service: SettingsManagementService = inject(SettingsManagementService);

  ngOnInit() {
    this.service.loadLocalStorage();
    this.defaultFolderPath = this.service.defaultFolderPath;
    this.showHidden = this.service.showHidden;
  }

  onClickSave() {
    this.service.saveLocalStorage(this.defaultFolderPath, this.showHidden);
  }
}
