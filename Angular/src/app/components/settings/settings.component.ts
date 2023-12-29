import { Component, OnInit, inject } from '@angular/core';
import { SettingsManagementService } from '../../services/settings-management.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  public service: SettingsManagementService = inject(SettingsManagementService);

  ngOnInit() {
    this.service.loadDefaultFolderPath();
  }

  onClickSave() {
    this.service.saveDefaultFolderPath();
  }
}
