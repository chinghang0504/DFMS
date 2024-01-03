import { Injectable } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // File Data
  currentFolderPath: string;
  desktopFilesHashCode: number;
  desktopFiles: DesktopFile[] = [];
  desktopFileTips: DesktopFile[] = [];

  // File Options
  all: boolean = false;

  // Sorting Options
  sortingMode: number = 0;
  ascending: boolean = true;

  // UI Data
  loading: boolean = true;

  // Filter Data
  // filterInput: string;
  // filteredDedsktopFiles: DesktopFile[] = [];

  constructor(private httpService: HttpService) { }

  getDesktopFiles() {
    this.loading = true;

    this.httpService.httpGetDesktopFiles(this.all, this.currentFolderPath)
      .subscribe(
        (res) => {
          console.log('Receiving Package...');
          console.log(res);

          let desktopFilesHashCode = res.desktopFilesHashCode;
          if (this.desktopFilesHashCode != desktopFilesHashCode) {
            this.desktopFilesHashCode = desktopFilesHashCode;
            this.desktopFiles = res.desktopFiles;
            this.sortDesktopFiles();
          }

          this.loading = false;
        }, (err) => {
          console.log(err);
        }
      );
  }

  openDesktopFile(desktopFilePath: string) {
    this.httpService.httpOpenDesktopFile(desktopFilePath)
      .subscribe(
        (res) => {
          console.log(res);
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
