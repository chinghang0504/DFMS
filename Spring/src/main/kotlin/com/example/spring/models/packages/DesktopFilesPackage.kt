package com.example.spring.models.packages

import com.example.spring.models.DesktopFile

data class DesktopFilesPackage(

    val fileList: List<DesktopFile>,
    val folderList: List<DesktopFile>
): CommunicationPackage()
