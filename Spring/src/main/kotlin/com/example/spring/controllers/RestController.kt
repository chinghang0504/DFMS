package com.example.spring.controllers

import com.example.spring.models.DesktopFile
import com.example.spring.models.DesktopFilePackage
import com.example.spring.models.ErrorPackage
import com.example.spring.models.ErrorStatus
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.awt.Desktop
import java.io.File
import java.nio.file.Files
import kotlin.io.path.Path

private const val GET_DESKTOP_FILE_PACKAGE_URL: String = "/getDesktopFilePackage";
private const val OPEN_DESKTOP_FILE_URL: String = "/openDesktopFile";
private const val DELETE_DESKTOP_FILE_URL: String = "/deleteDesktopFile";

@RestController
class RestController {

    private var desktopFilePackageDeferred: Deferred<ResponseEntity<*>>? = null
    private val desktopFilePackageMutex: Mutex = Mutex()

    // Get the desktop file package
    @GetMapping(GET_DESKTOP_FILE_PACKAGE_URL)
    suspend fun getDesktopFilePackage(@RequestParam path: String, @RequestParam all: Boolean): ResponseEntity<*> {
        desktopFilePackageMutex.withLock {
            desktopFilePackageDeferred?.cancel()

            desktopFilePackageDeferred = CoroutineScope(Dispatchers.Default).async {
                getFileAndFolderLists(path, all, this)
            }
        }

        return try {
            desktopFilePackageDeferred?.await() ?: getErrorPackage(ErrorStatus.GET_DESKTOP_FILE_PACKAGE_IS_TERMINATED)
        } catch (e: CancellationException) {
            getErrorPackage(ErrorStatus.GET_DESKTOP_FILE_PACKAGE_IS_TERMINATED)
        }
    }

    // Get the file and folder lists
    private fun getFileAndFolderLists(path: String, all: Boolean, coroutineScope: CoroutineScope): ResponseEntity<*> {
        val initialFolder: File = File(path)

        // Folder does not exists
        if (!initialFolder.exists()) {
            return getErrorPackage(ErrorStatus.FOLDER_DOES_NOT_EXIST)
        }
        // Not a folder
        else if (!initialFolder.isDirectory) {
            return getErrorPackage(ErrorStatus.NOT_A_FOLDER)
        }

        val fileList: ArrayList<DesktopFile> = ArrayList()
        val folderList: ArrayList<DesktopFile> = ArrayList()
        if (all) {
            addAllFiles(coroutineScope, initialFolder, fileList)
        } else {
            addCurrentFilesAndFolders(coroutineScope, initialFolder, fileList, folderList)
        }

        return ResponseEntity
            .accepted()
            .header("Access-Control-Allow-Origin", "*")
            .body(DesktopFilePackage(folderList, fileList))
    }

    // Get the error package
    private fun getErrorPackage(errorStatus: ErrorStatus): ResponseEntity<ErrorPackage> {
        return ResponseEntity
            .status(errorStatus.status)
            .header("Access-Control-Allow-Origin", "*")
            .body(ErrorPackage(errorStatus.message))
    }

    // Add all files
    private fun addAllFiles(coroutineScope: CoroutineScope, parentFolder: File, fileList: ArrayList<DesktopFile>) {
        parentFolder.listFiles()?.forEach {
            coroutineScope.ensureActive()

            if (it.isDirectory) {
                addAllFiles(coroutineScope, it, fileList)
            } else {
                fileList.add(getDesktopFile(it))
            }
        }
    }

    // Add files and folders within the current folder
    private fun addCurrentFilesAndFolders(coroutineScope: CoroutineScope, currentFolder: File, fileList: ArrayList<DesktopFile>, folderList: ArrayList<DesktopFile>) {
        currentFolder.listFiles()?.forEach {
            coroutineScope.ensureActive()

            if (it.isDirectory) {
                folderList.add(getDesktopFile(it))
            } else {
                fileList.add(getDesktopFile(it))
            }
        }
    }

    // Get the desktop file
    private fun getDesktopFile(file: File): DesktopFile {
        val size: Long = if (file.isDirectory) 0L else file.length()
        return DesktopFile(
            file.name, file.lastModified(), file.extension, size,
            file.absolutePath, file.parent,
            file.isDirectory, file.isHidden
        )
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
            getErrorPackage(ErrorStatus.UNABLE_TO_OPEN_FILE)
        }
    }

    // Delete the file
    @GetMapping(DELETE_DESKTOP_FILE_URL)
    fun deleteDesktopFile(@RequestParam path: String): ResponseEntity<*> {
        return try {
            Files.delete(Path(path))
            ResponseEntity
                .accepted()
                .header("Access-Control-Allow-Origin", "*")
                .build<Any>()
        } catch (e: Exception) {
            getErrorPackage(ErrorStatus.UNABLE_TO_DELETE_FILE)
        }
    }
}
