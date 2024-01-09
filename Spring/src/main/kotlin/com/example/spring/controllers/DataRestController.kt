package com.example.spring.controllers

import com.example.spring.models.DesktopFile
import com.example.spring.models.ErrorStatus
import com.example.spring.managers.ResponseEntityManager
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File

private const val GET_DESKTOP_FILE_PACKAGE_URL: String = "/getDesktopFilePackage";

@RestController
class DataRestController {

    private var deferred: Deferred<ResponseEntity<*>>? = null
    private val mutex: Mutex = Mutex()

    // Get the desktop file package
    @GetMapping(GET_DESKTOP_FILE_PACKAGE_URL)
    suspend fun getDesktopFilePackage(@RequestParam path: String, @RequestParam all: Boolean): ResponseEntity<*> {
        mutex.withLock {
            deferred?.cancel()

            deferred = CoroutineScope(Dispatchers.Default).async {
                getFileAndFolderLists(path, all, this)
            }
        }

        return try {
            deferred?.await() ?: ResponseEntityManager.get(ErrorStatus.GET_DESKTOP_FILE_PACKAGE_IS_TERMINATED)
        } catch (e: CancellationException) {
            ResponseEntityManager.get(ErrorStatus.GET_DESKTOP_FILE_PACKAGE_IS_TERMINATED)
        }
    }

    // Get the file and folder lists
    private fun getFileAndFolderLists(path: String, all: Boolean, coroutineScope: CoroutineScope): ResponseEntity<*> {
        val initialFolder: File = File(path)

        // Folder does not exists
        if (!initialFolder.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FOLDER_DOES_NOT_EXIST)
        }
        // Not a folder
        else if (!initialFolder.isDirectory) {
            return ResponseEntityManager.get(ErrorStatus.NOT_A_FOLDER)
        }

        val fileList: ArrayList<DesktopFile> = ArrayList()
        val folderList: ArrayList<DesktopFile> = ArrayList()
        if (all) {
            addAllFiles(coroutineScope, initialFolder, fileList)
        } else {
            addCurrentFilesAndFolders(coroutineScope, initialFolder, fileList, folderList)
        }

        return ResponseEntityManager.get(folderList, fileList)
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
}
