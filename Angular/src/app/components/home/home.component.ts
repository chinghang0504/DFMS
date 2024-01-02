import { Component, OnInit, inject } from '@angular/core';
import { DesktopFile } from '../../models/desktop-file';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public service: HomeService = inject(HomeService);
  public settingsService: SettingsService = inject(SettingsService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit() {
    if (!this.service.currentFolderPath) {
      this.settingsService.loadSettings();
      this.service.currentFolderPath = this.settingsService.defaultFolderPath;
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
    this.service.currentFolderPath = this.settingsService.defaultFolderPath;
    this.navigateSamePage();
  }

  navigateSamePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        'path': this.service.currentFolderPath
      }
    });
  }

  // onChangeFilterInput() {
  //   this.service.filteredDedsktopFiles = [];
  //   let regExp = new RegExp(this.service.filterInput, 'i');

  //   this.service.desktopFiles.forEach((value: DesktopFile) => {
  //     if (value.name.match(regExp)) {
  //       this.service.filteredDedsktopFiles.push(value);
  //     }
  //   });

  //   console.log(this.service.filteredDedsktopFiles);
  // }

  // onCurrentFolderPathFocus() {
  //   console.log('A');
  //   this.service.desktopFileTips = [];
  //   this.service.desktopFiles.forEach((value) => {
  //     if (value.type === 'folder') {
  //       this.service.desktopFileTips.push(value);
  //     }
  //   })
  //   console.log(this.service.desktopFileTips.length);
  // }

  // onClickTip(absolutePath: string) {
  //   this.service.currentFolderPath = absolutePath;
  //   this.service.getDesktopFiles();
  //   this.service.desktopFileTips = [];
  // }
}
