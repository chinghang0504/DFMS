import { Component, OnInit, inject } from '@angular/core';
import { DesktopFile } from '../../models/desktop-file';
import { HomeManagmenetService } from '../../services/home-managmenet.service';
import { SettingsManagementService } from '../../services/settings-management.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  public service: HomeManagmenetService = inject(HomeManagmenetService);
  private settingsManagementService: SettingsManagementService = inject(SettingsManagementService);

  ngOnInit() {
    if (!this.service.currentFolderPath) {
      this.settingsManagementService.loadDefaultFolderPath();
      this.service.currentFolderPath = this.settingsManagementService.defaultFolderPath;
    }
    this.service.getDesktopFiles();
  }

  onClickGetDesktopFiles(all: boolean) {
    this.service.all = all;
    this.service.getDesktopFiles();
  }

  onClickSorting(option: number) {
    if (this.service.sortingMode != option) {
      this.service.sortingMode = option;
      this.service.ascending = true;
    } else {
      this.service.ascending = !this.service.ascending;
    }

    this.service.sortDesktopFiles();
  }

  onClickTableRow(desktopFile: DesktopFile) {
    if (desktopFile.type === 'Folder') {
      this.service.currentFolderPath = desktopFile.absolutePath;
      this.service.getDesktopFiles();
    } else {
      this.service.openDesktopFile(desktopFile.absolutePath);
    }
  }

  onChangeCurrentFolderPath() {
    this.service.getDesktopFiles();
  }

  onClickRefresh() {
    this.service.getDesktopFiles();
  }
}
