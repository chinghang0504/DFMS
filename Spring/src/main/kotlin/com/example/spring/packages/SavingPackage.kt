package com.example.spring.packages

import com.google.gson.annotations.SerializedName

data class SavingPackage(

    @SerializedName("Settings")
    val settingsPackage: SettingsPackage,
    @SerializedName("FileTags")
    val fileTagsPackage: FileTagsPackage
): CommunicationPackage()
