package com.example.spring.managers

import com.example.spring.models.*
import com.example.spring.packages.CommunicationPackage
import com.example.spring.packages.DesktopFilesPackage
import com.example.spring.packages.ErrorPackage
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity

class ResponseEntityManager {

    companion object {

        // Get the empty package
        fun get(): ResponseEntity<Any> {
            return ResponseEntity
                .accepted()
                .build()
        }

        // Get the error package
        fun get(errorStatus: ErrorStatus): ResponseEntity<ErrorPackage> {
            return ResponseEntity
                .status(errorStatus.status)
                .body(ErrorPackage(errorStatus.message))
        }

        // Get the desktop file package
        fun get(fileList: List<DesktopFile>, folderList: List<DesktopFile>): ResponseEntity<DesktopFilesPackage> {
            return ResponseEntity
                .accepted()
                .body(DesktopFilesPackage(fileList, folderList))
        }

        // Get the desktop file
        fun get(desktopFile: DesktopFile): ResponseEntity<DesktopFile> {
            return ResponseEntity
                .accepted()
                .body(desktopFile)
        }

        // Get the package
        fun get(responseEntityPackage: CommunicationPackage): ResponseEntity<CommunicationPackage> {
            return ResponseEntity
                .accepted()
                .body(responseEntityPackage)
        }
    }
}
