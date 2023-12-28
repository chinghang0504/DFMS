import { Injectable, inject } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DesktopFileManagmentService {

  currentFolderPath: string = 'C:\\Users\\Ching Hang\\OneDrive\\Library\\Computer Science';
  desktopFiles: DesktopFile[] = [];
  all: boolean = false;

  private httpClient: HttpClient = inject(HttpClient);

  httpGetDesktopFiles() {
    this.httpClient.get(
      `http://localhost:8080/httpGetDesktopFiles?all=${this.all}&path=${encodeURIComponent(this.currentFolderPath)}`,
    ).subscribe(
      (res) => {
        this.desktopFiles = res['desktopFiles'];
      }, (err) => {
        console.log(err);
      }
    );
  }
}
