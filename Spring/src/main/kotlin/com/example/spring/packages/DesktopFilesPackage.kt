package com.example.spring.packages

import com.example.spring.models.DesktopFile

data class DesktopFilesPackage(

    val fileList: List<DesktopFile>,
    val folderList: List<DesktopFile>
): CommunicationPackage()
