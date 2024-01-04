package com.example.spring.models

const val FOLDER_DESKTOP_FILE_TYPE = "folder"

data class DesktopFile(

    val name: String,
    val type: String,
    val size: Long?,
    val absolutePath: String,
    val isHidden: Boolean,
    val lastModified: Long?
)
