package com.example.spring.models

data class DesktopFile(

    val name: String,
    val lastModified: Long,
    val extension: String,
    val size: Long,

    val absolutePath: String,

    val isFolder: Boolean,
    val isHidden: Boolean
)
