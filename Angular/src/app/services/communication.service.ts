import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLsManager } from '../managers/urls.manager';
import { SavingPackage } from '../models/packages/saving.package';
import { TagsPackage } from '../models/packages/tags.package';
import { SettingsPackage } from '../models/packages/settings.package';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  // Injection
  constructor(private httpClient: HttpClient) { }

  // // Http load the saving
  httpLoadSaving(): Observable<SavingPackage> {
    return this.httpClient.get<SavingPackage>(
      URLsManager.SERVER_URL + URLsManager.LOAD_SAVING_URL
    );
  }

  // Http save the settings
  httpSaveSettings(settingsPackage?: SettingsPackage): Observable<SettingsPackage> {
    return this.httpClient.post<SettingsPackage>(
      URLsManager.SERVER_URL + URLsManager.SAVE_SETTINGS_URL,
      settingsPackage
    );
  }

  // Http save the tags
  httpSaveTags(tagsPackage?: TagsPackage): Observable<TagsPackage> {
    return this.httpClient.post<TagsPackage>(
      URLsManager.SERVER_URL + URLsManager.SAVE_TAGS_URL,
      tagsPackage
    );
  }

  // Http get desktop files
  httpGetDesktopFiles(currentFolderPath: string, allLevels: boolean): Observable<Object> {
    return this.httpClient.get(
      URLsManager.SERVER_URL + URLsManager.GET_DESKTOP_FILES_URL,
      {
        params: {
          'path': currentFolderPath,
          'all': allLevels,
        }
      }
    );
  }

  // Http open a desktop file
  httpOpenDesktopFile(desktopFilePath: string): Observable<Object> {
    return this.httpClient.get(
      URLsManager.SERVER_URL + URLsManager.OPEN_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // Http get a desktop file
  httpGetDesktopFile(desktopFilePath: string): Observable<Object> {
    return this.httpClient.get(
      URLsManager.SERVER_URL + URLsManager.GET_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // Http modify a desktop file
  httpModifyDesktopFile(desktopFilePath: string, tagsPackage: TagsPackage): Observable<Object> {
    return this.httpClient.post(
      URLsManager.SERVER_URL + URLsManager.MODIFY_DESKTOP_FILE_TAGS_URL,
      tagsPackage,
      {
        params: {
          'path': desktopFilePath,
        }
      }
    );
  }
}
