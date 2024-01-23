package com.example.spring.models

private const val DEFAULT_HOME_FOLDER_PATH: String = "C:\\"
private const val DEFAULT_SHOW_HIDDEN: Boolean = false
private const val DEFAULT_REMOVE_DOUBLE_CONFIRMATION: Boolean = true

data class SettingsPackage(

    val homeFolderPath: String,
    val showHidden: Boolean,
    val removeDoubleConfirmation: Boolean
) {
    companion object {
        fun getDefault(): SettingsPackage = SettingsPackage(DEFAULT_HOME_FOLDER_PATH, DEFAULT_SHOW_HIDDEN, DEFAULT_REMOVE_DOUBLE_CONFIRMATION)
    }
}
