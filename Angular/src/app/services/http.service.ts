import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly serverUrl: string = 'http://localhost:8080/'

  private httpClient: HttpClient = inject(HttpClient);

  httpGetDesktopFiles(all: boolean, currentFolderPath: string) {
    return this.httpClient.get(
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
