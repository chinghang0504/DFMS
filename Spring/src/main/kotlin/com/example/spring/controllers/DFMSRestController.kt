package com.example.spring.controllers

import com.example.spring.models.DesktopFile
import com.example.spring.models.DesktopFilePackage
import com.example.spring.models.ErrorPackage
import com.example.spring.models.ErrorStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.awt.Desktop
import java.io.File

private const val GET_DESKTOP_FILE_PACKAGE_URL: String = "/getDesktopFilePackage";
private const val OPEN_DESKTOP_FILE_URL: String = "/openDesktopFile";

@RestController
class DFMSRestController {

    // Get the desktop file package
    @GetMapping(GET_DESKTOP_FILE_PACKAGE_URL)
    fun getDesktopFilePackage(@RequestParam path: String, @RequestParam all: Boolean): ResponseEntity<*> {
        val initialFolder: File = File(path)

        // Folder does not exists
        if (!initialFolder.exists()) {
            return getErrorPackageResponseEntity(ErrorStatus.FOLDER_DOES_NOT_EXIST)
        }
        // Not a folder
        else if (!initialFolder.isDirectory) {
            return getErrorPackageResponseEntity(ErrorStatus.NOT_A_FOLDER)
        }

        val fileList: ArrayList<DesktopFile> = ArrayList()
        val folderList: ArrayList<DesktopFile> = ArrayList()
        if (all)
            addAllFiles(initialFolder, fileList)
        else
            addCurrentFilesAndFolders(initialFolder, fileList, folderList)

        val sortedFileList: List<DesktopFile> = fileList.sortedBy { it.name.lowercase() }
        val sortedFolderList: List<DesktopFile> = folderList.sortedBy { it.name.lowercase() }

        return ResponseEntity
            .accepted()
            .header("Access-Control-Allow-Origin", "*")
            .body(DesktopFilePackage(sortedFolderList, sortedFileList))
    }

    // Open the file
    @GetMapping(OPEN_DESKTOP_FILE_URL)
    fun openDesktopFile(@RequestParam path: String): ResponseEntity<*> {
        return try {
            Desktop.getDesktop().open(File(path))
            ResponseEntity
                .accepted()
                .header("Access-Control-Allow-Origin", "*")
                .build<Any>()
        } catch (e: Exception) {
            getErrorPackageResponseEntity(ErrorStatus.UNABLE_TO_OPEN_FILE)
        }
    }

    // Get a response entity of error package
    private fun getErrorPackageResponseEntity(errorStatus: ErrorStatus): ResponseEntity<ErrorPackage> {
        return ResponseEntity
            .status(errorStatus.status)
            .header("Access-Control-Allow-Origin", "*")
            .body(ErrorPackage(errorStatus.message))
    }

    // Add all files
    private fun addAllFiles(parentFolder: File, fileList: ArrayList<DesktopFile>) {
        parentFolder.listFiles()?.forEach {
            if (it.isDirectory)
                addAllFiles(it, fileList)
            else
                fileList.add(
                    DesktopFile(
                        it.name, it.lastModified(), it.extension, it.length(),
                        it.absolutePath, it.parent,
                        it.isDirectory, it.isHidden
                    )
                )
        }
    }

    // Add files and folders within the current folder
    private fun addCurrentFilesAndFolders(
        currentFolder: File,
        fileList: ArrayList<DesktopFile>,
        folderList: ArrayList<DesktopFile>
    ) {
        currentFolder.listFiles()?.forEach {
            if (it.isDirectory)
                folderList.add(
                    DesktopFile(
                        it.name, it.lastModified(), it.extension, it.length(),
                        it.absolutePath, it.parent,
                        it.isDirectory, it.isHidden
                    )
                )
            else
                fileList.add(
                    DesktopFile(
                        it.name, it.lastModified(), it.extension, it.length(),
                        it.absolutePath, it.parent,
                        it.isDirectory, it.isHidden
                    )
                )
        }
    }
}
