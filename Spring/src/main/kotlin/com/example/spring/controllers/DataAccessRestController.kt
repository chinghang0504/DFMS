package com.example.spring.controllers

import com.example.spring.models.ErrorStatus
import com.example.spring.managers.ResponseEntityManager
import com.example.spring.managers.URLsManager.Companion.DEVELOPMENT_URL
import com.example.spring.managers.URLsManager.Companion.GET_DESKTOP_FILES_URL
import com.example.spring.managers.URLsManager.Companion.GET_DESKTOP_FILE_URL
import com.example.spring.models.packages.CommunicationPackage
import com.example.spring.models.packages.DesktopFilePackage
import com.example.spring.services.DataService
import kotlinx.coroutines.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

@CrossOrigin(DEVELOPMENT_URL)
@RestController
class DataAccessRestController {

    @Autowired
    private lateinit var dataService: DataService

    private var deferred: Deferred<ResponseEntity<out CommunicationPackage>>? = null
    private val reentrantLock: ReentrantLock = ReentrantLock()

    // Http get desktop files
    @GetMapping(GET_DESKTOP_FILES_URL)
    suspend fun httpGetDesktopFiles(@RequestParam path: String, @RequestParam all: Boolean): ResponseEntity<out CommunicationPackage> {
        val localDeferred: Deferred<ResponseEntity<out CommunicationPackage>>

        reentrantLock.withLock {
            // Terminate the previous coroutine
            deferred?.cancel()

            // Start a new coroutine
            localDeferred = CoroutineScope(Dispatchers.Default).async {
                val initialFolder: File = File(path)

                // Folder does not exists
                if (!initialFolder.exists()) {
                    ResponseEntityManager.get(ErrorStatus.FOLDER_DOES_NOT_EXIST)
                } // Not a folder
                else if (!initialFolder.isDirectory) {
                    ResponseEntityManager.get(ErrorStatus.NOT_A_FOLDER)
                } else {
                    ResponseEntityManager.get(dataService.getDesktopFiles(initialFolder, all, this))
                }
            }
            deferred = localDeferred
        }

        return try {
            // Wait for a coroutine finished
            localDeferred.await()
        } catch (e: Exception) {
            ResponseEntityManager.get(ErrorStatus.GET_DESKTOP_FILES_IS_CANCELED)
        }
    }

    // Http get a desktop file
    @GetMapping(GET_DESKTOP_FILE_URL)
    fun httpGetDesktopFile(@RequestParam path: String): ResponseEntity<out CommunicationPackage> {
        val file: File = File(path)

        // File or folder does not exist
        if (!file.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FILE_OR_FOLDER_DOES_NOT_EXIST)
        }

        return ResponseEntityManager.get(DesktopFilePackage(dataService.getDesktopFile(file)))
    }
}
