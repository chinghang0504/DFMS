package com.example.spring.models.packages

import com.google.gson.annotations.SerializedName

data class SavingPackage(

    @SerializedName("Settings")
    val settingsPackage: SettingsPackage = SettingsPackage(),

    @SerializedName("Tags")
    val tagsPackage: TagsPackage = TagsPackage()
): CommunicationPackage()
