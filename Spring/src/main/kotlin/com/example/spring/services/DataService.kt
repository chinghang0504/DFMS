package com.example.spring.services

import com.example.spring.managers.KeysManager
import com.example.spring.models.DesktopFile
import com.example.spring.models.packages.DesktopFilesPackage
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.ensureActive
import org.springframework.stereotype.Service
import java.io.File
import java.lang.reflect.Type
import java.nio.ByteBuffer
import java.nio.file.Files
import java.nio.file.attribute.UserDefinedFileAttributeView
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.concurrent.read
import kotlin.concurrent.write

@Service
class DataService {

    private val reentrantReadWriteLock: ReentrantReadWriteLock = ReentrantReadWriteLock()

    // Get desktop files
    fun getDesktopFiles(initialFolder: File, all: Boolean, coroutineScope: CoroutineScope): DesktopFilesPackage {
        val fileList: MutableList<DesktopFile> = mutableListOf()
        val folderList: MutableList<DesktopFile> = mutableListOf()

        if (all) {
            addAllDesktopFiles(initialFolder, coroutineScope, fileList, folderList)
        } else {
            addCurrentDesktopFiles(initialFolder, coroutineScope, fileList, folderList)
        }

        return DesktopFilesPackage(fileList.toList(), folderList.toList())
    }

    // Add all desktop files
    private fun addAllDesktopFiles(parentFolder: File, coroutineScope: CoroutineScope, fileList: MutableList<DesktopFile>, folderList: MutableList<DesktopFile>) {
        parentFolder.listFiles()?.forEach {
            // Throw an exception if the coroutine is canceled
            coroutineScope.ensureActive()

            if (it.isDirectory) {
                folderList.add(getDesktopFile(it))
                addAllDesktopFiles(it, coroutineScope, fileList, folderList)
            } else {
                fileList.add(getDesktopFile(it))
            }
        }
    }

    // Add current desktop files
    private fun addCurrentDesktopFiles(currentFolder: File, coroutineScope: CoroutineScope, fileList: MutableList<DesktopFile>, folderList: MutableList<DesktopFile>) {
        currentFolder.listFiles()?.forEach {
            // Throw an exception if the coroutine is canceled
            coroutineScope.ensureActive()

            if (it.isDirectory) {
                folderList.add(getDesktopFile(it))
            } else {
                fileList.add(getDesktopFile(it))
            }
        }
    }

    // Get a desktop file
    fun getDesktopFile(file: File): DesktopFile {
        return DesktopFile(
            file.name, file.lastModified(), file.extension, file.length(),
            file.absolutePath, file.parent,
            file.isDirectory, file.isHidden,
            readTags(file))
    }

    // Read the tags of a desktop file
    private fun readTags(file: File): List<String> {
        val byteBuffer: ByteBuffer

        return try {
            reentrantReadWriteLock.read {
                val userView: UserDefinedFileAttributeView = Files.getFileAttributeView(file.toPath(), UserDefinedFileAttributeView::class.java)
                byteBuffer = ByteBuffer.allocate(userView.size(KeysManager.TAGS_KEY))
                userView.read(KeysManager.TAGS_KEY, byteBuffer)
            }
            byteBuffer.flip()

            val tagsString: String = String(byteBuffer.array(), 0, byteBuffer.limit())
            val typeToken: Type = object: TypeToken<List<String>>() {}.type
            Gson().fromJson(tagsString, typeToken)
        } catch (e: Exception) {
            listOf()
        }
    }

    // Write the tags of a desktop file
    fun writeTags(file: File, tags: List<String>) {
        val byteArray: ByteArray = Gson().toJson(tags).toByteArray()

        reentrantReadWriteLock.write {
            val userView: UserDefinedFileAttributeView = Files.getFileAttributeView(file.toPath(), UserDefinedFileAttributeView::class.java)
            userView.write(KeysManager.TAGS_KEY, ByteBuffer.wrap(byteArray))
        }
    }
}
