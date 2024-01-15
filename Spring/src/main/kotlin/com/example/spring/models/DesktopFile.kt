package com.example.spring.models

data class DesktopFile(

    val name: String,
    val lastModified: Long,
    val extension: String,
    val size: Long,

    val absolutePath: String,
    val parentFolderPath: String,

    val isFolder: Boolean,
    val isHidden: Boolean,

    val tags: List<String>?
)
