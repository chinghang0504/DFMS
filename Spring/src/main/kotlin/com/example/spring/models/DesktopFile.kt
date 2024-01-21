package com.example.spring.models

data class DesktopFile(

    val name: String,
    val lastModified: Long,
    val type: String,
    val size: Long,

    val absolutePath: String,
    val parentPath: String,

    val isFolder: Boolean,
    val isHidden: Boolean,

    val tags: List<String>
)
