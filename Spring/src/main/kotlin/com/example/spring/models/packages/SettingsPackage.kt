package com.example.spring.models.packages

import com.google.gson.annotations.SerializedName

private const val DEFAULT_HOME_FOLDER_PATH: String = "C:\\"
private const val DEFAULT_SHOW_HIDDEN: Boolean = false
private const val DEFAULT_FILES_PER_PAGE: Int = 25
private const val DEFAULT_TAG_REMOVAL_DOUBLE_CONFIRMATION: Boolean = true

data class SettingsPackage(

    // File Browser Settings
    @SerializedName("home_folder_path")
    val homeFolderPath: String = DEFAULT_HOME_FOLDER_PATH,
    @SerializedName("files_per_page")
    val filesPerPage: Int = DEFAULT_FILES_PER_PAGE,

    // File Settings
    @SerializedName("show_hidden")
    val showHidden: Boolean = DEFAULT_SHOW_HIDDEN,

    // Tag Settings
    @SerializedName("tag_removal_double_confirmation")
    val tagRemovalDoubleConfirmation: Boolean = DEFAULT_TAG_REMOVAL_DOUBLE_CONFIRMATION
): CommunicationPackage()
