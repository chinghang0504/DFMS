package com.example.spring.controllers

import com.example.spring.models.*
import com.example.spring.models.comparators.DesktopFileComparator
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.awt.Desktop
import java.io.File
import java.net.URLDecoder

const val GET_DESKTOP_FILE_PACKAGE_URL: String = "/getDesktopFilePackage";
const val OPEN_DESKTOP_FILE_URL: String = "/openDesktopFile";

@RestController
class DesktopFileRestController {

    // Get the desktop file package
    @GetMapping(GET_DESKTOP_FILE_PACKAGE_URL)
    fun getDesktopFilePackage(@RequestParam path: String, @RequestParam all: Boolean): ResponseEntity<*> {
        val initialFolder: File = File(URLDecoder.decode(path))

        // Error Checking
        // Folder does not exists
        if (!initialFolder.exists()) {
            return getErrorPackageResponseEntity(ErrorStatus.FOLDER_DOES_NOT_EXIST)
        }
        // Not a folder
        else if (!initialFolder.isDirectory) {
            return getErrorPackageResponseEntity(ErrorStatus.NOT_A_FOLDER)
        }

        // Get the desktop files
        val desktopFiles: ArrayList<DesktopFile> = ArrayList<DesktopFile>()
        if (all)
            addAllDesktopFiles(initialFolder, desktopFiles)
        else
            addCurrentDesktopFiles(initialFolder, desktopFiles)

        // Sort the desktop files
        val sortedDesktopFiles: List<DesktopFile> = desktopFiles.sortedWith(DesktopFileComparator)

        return ResponseEntity
            .ok()
            .header("Access-Control-Allow-Origin", "*")
            .body(DesktopFilePackage(sortedDesktopFiles))
    }

    // Open the desktop file
    @GetMapping(OPEN_DESKTOP_FILE_URL)
    fun openDesktopFile(@RequestParam path: String): ResponseEntity<*> {
        return try {
            Desktop.getDesktop().open(File(path))
            ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .header("Access-Control-Allow-Origin", "*")
                .build<Any>()
        } catch (e: Exception) {
            getErrorPackageResponseEntity(ErrorStatus.UNABLE_TO_OPEN_DESKTOP_FILE)
        }
    }

    // Get a response entity of error package
    private fun getErrorPackageResponseEntity(errorStatus: ErrorStatus): ResponseEntity<ErrorPackage> {
        return ResponseEntity
            .status(errorStatus.status)
            .header("Access-Control-Allow-Origin", "*")
            .body(ErrorPackage(errorStatus.message))
    }

    // Add all desktop files
    private fun addAllDesktopFiles(parentFolder: File, desktopFiles: ArrayList<DesktopFile>) {
        parentFolder.listFiles()?.forEach {
            if (it.isDirectory)
                addAllDesktopFiles(it, desktopFiles)
            else
                desktopFiles.add(DesktopFile(it.name, it.extension, it.length(), it.absolutePath, it.isHidden, it.lastModified()))
        }
    }

    // Add desktop file and directory within the current folder
    private fun addCurrentDesktopFiles(currentFolder: File, desktopFiles: ArrayList<DesktopFile>) {
        currentFolder.listFiles()?.forEach {
            if (it.isDirectory)
                desktopFiles.add(DesktopFile(it.name, FOLDER_DESKTOP_FILE_TYPE, null, it.absolutePath, it.isHidden, null))
            else
                desktopFiles.add(DesktopFile(it.name, it.extension, it.length(), it.absolutePath, it.isHidden, it.lastModified()))
        }
    }
}