import { Component, OnInit, inject } from '@angular/core';
import { DesktopFileManagmentService } from '../../services/desktop-file-managment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private desktopFileManagmentService: DesktopFileManagmentService = inject(DesktopFileManagmentService);

  get desktopFiles() {
    return this.desktopFileManagmentService.desktopFiles;
  }

  get currentFolderPath() {
    return this.desktopFileManagmentService.currentFolderPath;
  }

  get all() {
    return this.desktopFileManagmentService.all;
  }

  ngOnInit() {
    this.desktopFileManagmentService.httpGetDesktopFiles();
  }

  onClickGetDesktopFiles(all: boolean) {
    this.desktopFileManagmentService.all = all;
    this.desktopFileManagmentService.httpGetDesktopFiles();
  }
}
