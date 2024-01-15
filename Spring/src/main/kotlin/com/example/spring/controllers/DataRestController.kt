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
private const val CHANGE_DESKTOP_FILE_URL: String = "/changeDesktopFile"
private const val TAGS_KEY: String = "TAGS"

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
        return if (file.isDirectory) {
            DesktopFile(
                file.name, file.lastModified(), file.extension, 0L,
                file.absolutePath, file.parent,
                file.isDirectory, file.isHidden,
                null)
        } else {
            DesktopFile(
                file.name, file.lastModified(), file.extension, file.length(),
                file.absolutePath, file.parent,
                file.isDirectory, file.isHidden,
                readTags(file))
        }
    }

    // Read tags from a desktop file
    private fun readTags(file: File): List<String> {
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

    // Get a desktop file
    @GetMapping(GET_DESKTOP_FILE_URL)
    fun getDesktopFile(@RequestParam path: String): ResponseEntity<*> {
        val file: File = File(path)
        return if (file.exists()) {
            ResponseEntityManager.get(getDesktopFile(file))
        } else {
            ResponseEntityManager.get(ErrorStatus.FILE_DOES_NOT_EXIST)
        }
    }

    // Change a desktop file
    @GetMapping(CHANGE_DESKTOP_FILE_URL)
    fun changeDesktopFile(@RequestParam path: String, @RequestParam(required = false) tags: List<String> = listOf()): ResponseEntity<*> {
        return try {
            val file = File(path)
            if (writeTags(file, tags)) {
                ResponseEntityManager.get()
            } else {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_CHANGE_TAGS)
            }
        } catch (e: Exception) {
            println(e)
            ResponseEntityManager.get(ErrorStatus.UNABLE_TO_CHANGE_TAGS)
        }
    }

    // Write tags into a desktop file
    private fun writeTags(file: File, list: List<String>): Boolean {
        return try {
            val userView: UserDefinedFileAttributeView = Files.getFileAttributeView(file.toPath(), UserDefinedFileAttributeView::class.java)
            val byteArray: ByteArray = Gson().toJson(list).toByteArray()
            userView.write(TAGS_KEY, ByteBuffer.wrap(byteArray))
            true
        } catch (e: Exception) {
            false
        }
    }
}
