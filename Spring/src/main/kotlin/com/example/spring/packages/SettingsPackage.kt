package com.example.spring.packages

import com.google.gson.annotations.SerializedName

private const val DEFAULT_HOME_FOLDER_PATH: String = "C:\\"
private const val DEFAULT_SHOW_HIDDEN: Boolean = false
private const val DEFAULT_REMOVE_DOUBLE_CONFIRMATION: Boolean = true

data class SettingsPackage(

    @SerializedName("HomeFolderPath")
    val homeFolderPath: String,
    @SerializedName("ShowHidden")
    val showHidden: Boolean,
    @SerializedName("RemoveDoubleConfirmation")
    val removeDoubleConfirmation: Boolean
): CommunicationPackage() {
    companion object {
        fun getDefault(): SettingsPackage =
            SettingsPackage(DEFAULT_HOME_FOLDER_PATH, DEFAULT_SHOW_HIDDEN, DEFAULT_REMOVE_DOUBLE_CONFIRMATION)
    }
}