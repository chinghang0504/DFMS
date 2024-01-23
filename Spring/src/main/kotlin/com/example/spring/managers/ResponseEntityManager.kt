package com.example.spring.managers

import com.example.spring.models.*
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
        fun get(fileList: List<DesktopFile>, folderList: List<DesktopFile>): ResponseEntity<DesktopFilePackage> {
            return ResponseEntity
                .accepted()
                .header("Access-Control-Allow-Origin", "*")
                .body(DesktopFilePackage(fileList, folderList))
        }

        // Get the package
        fun<T> get(responseEntityPackage: T): ResponseEntity<T> {
            return ResponseEntity
                .accepted()
                .header("Access-Control-Allow-Origin", "*")
                .body(responseEntityPackage)
        }
    }
}
