package com.example.spring.controllers

import com.example.spring.models.DesktopFile
import com.example.spring.models.ErrorStatus
import com.example.spring.managers.ResponseEntityManager
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.lang.reflect.Type
import java.nio.ByteBuffer
import java.nio.file.Files
import java.nio.file.attribute.UserDefinedFileAttributeView

private const val GET_DESKTOP_FILE_PACKAGE_URL: String = "/getDesktopFilePackage"
private const val GET_DESKTOP_FILE_URL: String = "/getDesktopFile"
internal const val TAGS_KEY: String = "TAGS"

@RestController
class DataAccessRestController {

    private val mutex: Mutex = Mutex()
    private var deferred: Deferred<ResponseEntity<*>>? = null

    // Http get a desktop file package
    @GetMapping(GET_DESKTOP_FILE_PACKAGE_URL)
    suspend fun httpGetDesktopFilePackage(@RequestParam path: String, @RequestParam all: Boolean): ResponseEntity<*> {
        var localDeferred: Deferred<ResponseEntity<*>>
        mutex.withLock {
            // Terminate the previous coroutine
            deferred?.cancel()

            // Start a new coroutine
            localDeferred = CoroutineScope(Dispatchers.Default).async {
                getDesktopFilePackage(path, all, this)
            }
            deferred = localDeferred
        }

        return try {
            // Wait for a coroutine finish
            localDeferred.await()
        } catch (e: Exception) {
            ResponseEntityManager.get(ErrorStatus.GET_DESKTOP_FILE_PACKAGE_IS_CANCELED)
        }
    }

    // Get a desktop file package
    private fun getDesktopFilePackage(path: String, all: Boolean, coroutineScope: CoroutineScope): ResponseEntity<*> {
        val initialFolder: File = File(path)

        // Folder does not exists
        if (!initialFolder.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FOLDER_DOES_NOT_EXIST)
        } // Not a folder
        else if (!initialFolder.isDirectory) {
            return ResponseEntityManager.get(ErrorStatus.NOT_A_FOLDER)
        }

        val fileList: ArrayList<DesktopFile> = ArrayList()
        val folderList: ArrayList<DesktopFile> = ArrayList()
        if (all) {
            addAllFiles(initialFolder, coroutineScope, fileList)
        } else {
            addCurrentFilesAndFolders(initialFolder, coroutineScope, fileList, folderList)
        }

        return ResponseEntityManager.get(fileList, folderList)
    }

    // Add all files
    private fun addAllFiles(parentFolder: File, coroutineScope: CoroutineScope, fileList: ArrayList<DesktopFile>) {
        parentFolder.listFiles()?.forEach {
            // Throw an exception if the coroutine is not active
            coroutineScope.ensureActive()

            if (it.isDirectory) {
                addAllFiles(it, coroutineScope, fileList)
            } else {
                fileList.add(getDesktopFile(it))
            }
        }
    }

    // Add files and folders within the current folder
    private fun addCurrentFilesAndFolders(currentFolder: File, coroutineScope: CoroutineScope, fileList: ArrayList<DesktopFile>, folderList: ArrayList<DesktopFile>) {
        currentFolder.listFiles()?.forEach {
            // Throw an exception if the coroutine is not active
            coroutineScope.ensureActive()

            if (it.isDirectory) {
                folderList.add(getDesktopFile(it))
            } else {
                fileList.add(getDesktopFile(it))
            }
        }
    }

    // Get a desktop file
    private fun getDesktopFile(file: File): DesktopFile {
        return DesktopFile(
                file.name, file.lastModified(), file.extension, file.length(),
                file.absolutePath, file.parent,
                file.isDirectory, file.isHidden,
                getTags(file))
    }

    // Get tags from a desktop file
    private fun getTags(file: File): List<String> {
        return try {
            val userView: UserDefinedFileAttributeView = Files.getFileAttributeView(file.toPath(), UserDefinedFileAttributeView::class.java)
            val byteBuffer: ByteBuffer = ByteBuffer.allocate(userView.size(TAGS_KEY))
            userView.read(TAGS_KEY, byteBuffer)
            byteBuffer.flip()

            val typeToken: Type = object: TypeToken<List<String>>() {}.type
            val str: String = String(byteBuffer.array(), 0, byteBuffer.limit())
            Gson().fromJson(str, typeToken)
        } catch (e: Exception) {
            listOf()
        }
    }

    // Http get a desktop file
    @GetMapping(GET_DESKTOP_FILE_URL)
    fun httpGetDesktopFile(@RequestParam path: String): ResponseEntity<*> {
        val file: File = File(path)

        // File or folder does not exist
        if (!file.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FILE_OR_FOLDER_DOES_NOT_EXIST)
        }

        return ResponseEntityManager.get(getDesktopFile(file))
    }
}
