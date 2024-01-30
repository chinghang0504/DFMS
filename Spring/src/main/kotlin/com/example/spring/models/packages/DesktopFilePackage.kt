package com.example.spring.models.packages

import com.example.spring.models.DesktopFile

data class DesktopFilePackage(

    val desktopFile: DesktopFile
): CommunicationPackage()
