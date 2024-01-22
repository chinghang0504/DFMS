import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsPackage } from '../models/settings-package';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  // Server data
  private readonly SERVER_URL: string = 'http://localhost:8080';
  private readonly OPEN_DESKTOP_FILE_URL: string = '/openDesktopFile';
  private readonly DELETE_DESKTOP_FILE_URL: string = '/deleteDesktopFile';
  private readonly GET_DESKTOP_FILE_PACKAGE_URL: string = '/getDesktopFilePackage';
  private readonly GET_DESKTOP_FILE_URL: string = '/getDesktopFile';
  private readonly MODIFY_DESKTOP_FILE_URL: String = "/modifyDesktopFile";
  private readonly LOAD_SETTINGS_URL: String = "/loadSettings";
  private readonly SAVE_SETTINGS_URL: String = "/saveSettings";

  // Injection
  constructor(private httpClient: HttpClient) { }

  // Http open a desktop file
  httpOpenDesktopFile(desktopFilePath: string): Observable<Object> {
    return this.httpClient.get(
      this.SERVER_URL + this.OPEN_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // Http delete a desktop file
  httpDeleteDesktopFile(desktopFilePath: string): Observable<Object> {
    return this.httpClient.get(
      this.SERVER_URL + this.DELETE_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // Http get a desktop file package
  httpGetDesktopFilePackage(currentFolderPath: string, allFiles: boolean): Observable<Object> {
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

  // Http get a desktop file
  httpGetDesktopFile(desktopFilePath: string): Observable<Object> {
    return this.httpClient.get(
      this.SERVER_URL + this.GET_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // Http modify a desktop file
  httpModifyDesktopFile(desktopFilePath: string, tags: string[]): Observable<Object> {
    return this.httpClient.get(
      this.SERVER_URL + this.MODIFY_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath,
          'tags': tags
        }
      }
    );
  }

  // Http load settings
  httpLoadSettings(): Observable<Object> {
    return this.httpClient.get(
      this.SERVER_URL + this.LOAD_SETTINGS_URL,
    );
  }

  // Http save settings
  httpSaveSettings(settingsPackage?: SettingsPackage): Observable<Object> {
    return this.httpClient.post<SettingsPackage>(
      this.SERVER_URL + this.SAVE_SETTINGS_URL,
      settingsPackage
    );
  }
}
