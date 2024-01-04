import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesktopCommunicationService {

  // Server Data
  private readonly SERVER_URL: string = 'http://localhost:8080/';
  private readonly GET_DESKTOP_FILE_PACKAGE_URL: string = 'getDesktopFilePackage';
  private readonly OPEN_DESKTOP_FILE_URL: string = 'openDesktopFile';

  // Injection
  constructor(private httpClient: HttpClient) { }

  // Get a desktop file package
  getDesktopFilePackage(currentFolderPath: string, allFiles: boolean) {
    return this.httpClient.get(
      this.SERVER_URL + this.GET_DESKTOP_FILE_PACKAGE_URL,
      {
        params: {
          'path': currentFolderPath,
          'all': allFiles,
        }
      }
    );
  }

  // Open a desktop file
  openDesktopFile(desktopFilePath: string) {
    return this.httpClient.get(
      this.SERVER_URL + this.OPEN_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }
}