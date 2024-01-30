package com.example.spring.managers

class URLsManager {

    companion object {
        const val SERVER_URL: String = "http://localhost:8080"
        const val DEVELOPMENT_URL: String = "http://localhost:4200"

        const val OPEN_DESKTOP_FILE_URL: String = "/openDesktopFile";
        const val DELETE_DESKTOP_FILE_URL: String = "/deleteDesktopFile";
        const val GET_DESKTOP_FILES_URL: String = "/getDesktopFiles"
        const val GET_DESKTOP_FILE_URL: String = "/getDesktopFile"
        const val MODIFY_DESKTOP_FILE_TAGS_URL: String = "/modifyDesktopFileTags"
        const val LOAD_SAVING_URL: String = "/loadSaving"
        const val SAVE_SETTINGS_URL: String = "/saveSettings"
        const val SAVE_TAGS_URL: String = "/saveTags"
    }
}
