import { Component, OnInit, inject } from '@angular/core';
import { DesktopFile } from '../../models/desktop-file';
import { HomeManagmenetService } from '../../services/home-managmenet.service';
import { SettingsManagementService } from '../../services/settings-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public service: HomeManagmenetService = inject(HomeManagmenetService);
  private settingsManagementService: SettingsManagementService = inject(SettingsManagementService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit() {
    if (!this.service.currentFolderPath) {
      this.settingsManagementService.loadDefaultFolderPath();
      this.service.currentFolderPath = this.settingsManagementService.defaultFolderPath;
    }

    this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        let queryParamsPath: string = queryParams['path'];
        if (queryParamsPath == null) {
          this.navigateSamePage();
        } else {
          this.service.currentFolderPath = queryParamsPath;
          this.service.getDesktopFiles();
        }
      });
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
    if (desktopFile.type === 'folder') {
      this.service.currentFolderPath = desktopFile.absolutePath;
      this.navigateSamePage();
    } else {
      this.service.openDesktopFile(desktopFile.absolutePath);
    }
  }

  onChangeCurrentFolderPath() {
    this.navigateSamePage();
  }

  onClickRefresh() {
    this.service.getDesktopFiles();
  }

  onClickParent() {
    let lastIndex = this.service.currentFolderPath.lastIndexOf('\\');
    if (lastIndex !== -1) {
      this.service.all = false;
      this.service.currentFolderPath = this.service.currentFolderPath.substring(0, lastIndex);
      this.navigateSamePage();
    }
  }

  onClickDefault() {
    this.service.all = false;
    this.service.currentFolderPath = this.settingsManagementService.defaultFolderPath;
    this.navigateSamePage();
  }

  navigateSamePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        'path': this.service.currentFolderPath
      }
    });
  }
}
