import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DesktopFilePackage } from '../models/desktop-file-package';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly serverUrl: string = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) { }

  httpGetDesktopFiles(all: boolean, currentFolderPath: string) {
    return this.httpClient.get<DesktopFilePackage>(
      `${this.serverUrl}httpGetDesktopFiles`,
      {
        params: {
          'all': all,
          'path': currentFolderPath
        }
      }
    );
  }

  httpOpenDesktopFile(desktopFilePath: string) {
    return this.httpClient.get(
      `${this.serverUrl}httpOpenDesktopFile`,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }
}
