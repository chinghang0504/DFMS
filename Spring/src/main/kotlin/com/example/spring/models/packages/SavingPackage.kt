package com.example.spring.models.packages

import com.google.gson.annotations.SerializedName

data class SavingPackage(

    @SerializedName("Settings")
    var settingsPackage: SettingsPackage = SettingsPackage(),

    @SerializedName("Tags")
    var tagsPackage: TagsPackage = TagsPackage()
): CommunicationPackage()
