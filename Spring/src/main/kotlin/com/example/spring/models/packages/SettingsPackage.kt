package com.example.spring.models.packages

import com.google.gson.annotations.SerializedName

private const val DEFAULT_HOME_FOLDER_PATH: String = "C:\\"
private const val DEFAULT_SHOW_HIDDEN: Boolean = false
private const val DEFAULT_TAG_REMOVAL_DOUBLE_CONFIRMATION: Boolean = true

data class SettingsPackage(

    @SerializedName("home_folder_path")
    var homeFolderPath: String = DEFAULT_HOME_FOLDER_PATH,

    @SerializedName("show_hidden")
    var showHidden: Boolean = DEFAULT_SHOW_HIDDEN,

    @SerializedName("tag_removal_double_confirmation")
    var tagRemovalDoubleConfirmation: Boolean = DEFAULT_TAG_REMOVAL_DOUBLE_CONFIRMATION
): CommunicationPackage()
