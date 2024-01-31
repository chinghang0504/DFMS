import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLsManager } from '../managers/urls.manager';
import { SavingPackage } from '../models/packages/saving.package';
import { TagsPackage } from '../models/packages/tags.package';
import { SettingsPackage } from '../models/packages/settings.package';
import { CommunicationPackage } from '../models/packages/communication.package';
import { DesktopFilesPackage } from '../models/packages/desktop-files.package';
import { DesktopFilePackage } from '../models/packages/desktop-file.package';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  // Injection
  constructor(private httpClient: HttpClient) { }

  // ActionRestController
  // Http open a desktop file
  httpOpenDesktopFile(desktopFilePath: string): Observable<CommunicationPackage> {
    return this.httpClient.get<CommunicationPackage>(
      URLsManager.SERVER_URL + URLsManager.OPEN_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // Http delete a desktop file
  httpDeleteDesktopFile(desktopFilePath: string): Observable<CommunicationPackage> {
    return this.httpClient.delete<CommunicationPackage>(
      URLsManager.SERVER_URL + URLsManager.DELETE_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // DataAccessRestController
  // Http get desktop files
  httpGetDesktopFiles(currentFolderPath: string, allLevels: boolean): Observable<DesktopFilesPackage> {
    return this.httpClient.get<DesktopFilesPackage>(
      URLsManager.SERVER_URL + URLsManager.GET_DESKTOP_FILES_URL,
      {
        params: {
          'path': currentFolderPath,
          'all': allLevels,
        }
      }
    );
  }

  // Http get a desktop file
  httpGetDesktopFile(desktopFilePath: string): Observable<DesktopFilePackage> {
    return this.httpClient.get<DesktopFilePackage>(
      URLsManager.SERVER_URL + URLsManager.GET_DESKTOP_FILE_URL,
      {
        params: {
          'path': desktopFilePath
        }
      }
    );
  }

  // DataModifyRestController
  // Http modify a desktop file
  httpModifyDesktopFile(desktopFilePath: string, tagsPackage: TagsPackage): Observable<DesktopFilePackage> {
    return this.httpClient.patch<DesktopFilePackage>(
      URLsManager.SERVER_URL + URLsManager.MODIFY_DESKTOP_FILE_TAGS_URL,
      tagsPackage,
      {
        params: {
          'path': desktopFilePath,
        }
      }
    );
  }

  // SavingRestController
  // Http load the saving
  httpLoadSaving(): Observable<SavingPackage> {
    return this.httpClient.get<SavingPackage>(
      URLsManager.SERVER_URL + URLsManager.LOAD_SAVING_URL
    );
  }

  // Http save the settings
  httpSaveSettings(settingsPackage?: SettingsPackage): Observable<SettingsPackage> {
    return this.httpClient.patch<SettingsPackage>(
      URLsManager.SERVER_URL + URLsManager.SAVE_SETTINGS_URL,
      settingsPackage
    );
  }

  // Http save the tags
  httpSaveTags(tagsPackage?: TagsPackage): Observable<TagsPackage> {
    return this.httpClient.patch<TagsPackage>(
      URLsManager.SERVER_URL + URLsManager.SAVE_TAGS_URL,
      tagsPackage
    );
  }
}
