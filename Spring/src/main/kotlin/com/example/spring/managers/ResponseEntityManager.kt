package com.example.spring.managers

import com.example.spring.models.DesktopFile
import com.example.spring.models.DesktopFilePackage
import com.example.spring.models.ErrorPackage
import com.example.spring.models.ErrorStatus
import org.springframework.http.ResponseEntity

class ResponseEntityManager {

    companion object {

        // Get the empty package
        fun get(): ResponseEntity<Any> {
            return ResponseEntity
                .accepted()
                .header("Access-Control-Allow-Origin", "*")
                .build()
        }

        // Get the error package
        fun get(errorStatus: ErrorStatus): ResponseEntity<ErrorPackage> {
            return ResponseEntity
                .status(errorStatus.status)
                .header("Access-Control-Allow-Origin", "*")
                .body(ErrorPackage(errorStatus.message))
        }

        // Get the desktop file package
        fun get(folderList: List<DesktopFile>, fileList: List<DesktopFile>): ResponseEntity<DesktopFilePackage> {
            return ResponseEntity
                .accepted()
                .header("Access-Control-Allow-Origin", "*")
                .body(DesktopFilePackage(folderList, fileList))
        }

        fun get(desktopFile: DesktopFile): ResponseEntity<DesktopFile> {
            return ResponseEntity
                .accepted()
                .header("Access-Control-Allow-Origin", "*")
                .body(desktopFile)
        }
    }
}