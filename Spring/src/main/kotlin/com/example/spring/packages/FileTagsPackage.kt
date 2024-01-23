package com.example.spring.packages

import com.google.gson.annotations.SerializedName

data class FileTagsPackage(

    @SerializedName("Tags")
    val fileTags: List<String>
): CommunicationPackage() {
    companion object {
        fun getDefault(): FileTagsPackage = FileTagsPackage(listOf())
    }
}
