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
  sortingMode: number = 0;
  ascending: boolean = true;

  private httpClient: HttpClient = inject(HttpClient);

  httpGetDesktopFiles() {
    this.httpClient.get(
      `http://localhost:8080/httpGetDesktopFiles?all=${this.all}&path=${encodeURIComponent(this.currentFolderPath)}`,
    ).subscribe(
      (res) => {
        this.desktopFiles = res['desktopFiles'];
        this.sortDesktopFiles();
      }, (err) => {
        console.log(err);
      }
    );
  }

  sortDesktopFiles() {
    let ascendingValue: number = this.ascending ? 1 : -1;

    if (this.sortingMode === 0) {
      this.desktopFiles.sort((a, b) => {
        let aLowerCase: string = a.name.toLowerCase();
        let bLowerCase: string = b.name.toLowerCase();

        if (aLowerCase < bLowerCase)
          return -1 * ascendingValue;
        else if (aLowerCase > bLowerCase)
          return 1 * ascendingValue;
        else
          return 0;
      });
    } else if (this.sortingMode === 1) {
      this.desktopFiles.sort((a, b) => {
        let aLowerCase: string = a.type.toLowerCase();
        let bLowerCase: string = b.type.toLowerCase();

        if (aLowerCase < bLowerCase)
          return -1 * ascendingValue;
        else if (aLowerCase > bLowerCase)
          return 1 * ascendingValue;
        else
          return 0;
      });
    } else if (this.sortingMode === 2) {
      this.desktopFiles.sort((a, b) => {
        if (a.size < b.size)
          return -1 * ascendingValue;
        else if (a.size > b.size)
          return 1 * ascendingValue;
        else
          return 0;
      });
    }
  }
}
