package com.example.spring.controllers

import com.example.spring.managers.ResponseEntityManager
import com.example.spring.managers.URLsManager.Companion.DELETE_DESKTOP_FILE_URL
import com.example.spring.managers.URLsManager.Companion.DEVELOPMENT_URL
import com.example.spring.managers.URLsManager.Companion.OPEN_DESKTOP_FILE_URL
import com.example.spring.models.ErrorStatus
import com.example.spring.models.packages.CommunicationPackage
import org.apache.tomcat.util.http.fileupload.FileUtils
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.nio.file.Files

@CrossOrigin(DEVELOPMENT_URL)
@RestController
class ActionRestController {

    // Http open a desktop file
    @GetMapping(OPEN_DESKTOP_FILE_URL)
    fun httpOpenDesktopFile(@RequestParam path: String): ResponseEntity<out CommunicationPackage> {
        val file: File = File(path)

        // File or folder does not exist
        if (!file.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FILE_OR_FOLDER_DOES_NOT_EXIST)
        }

        return try {
            ProcessBuilder("cmd", "/c", "start", "\"\"", path).start()
            ResponseEntityManager.get()
        } catch (e: Exception) {
            if (file.isDirectory) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_OPEN_FOLDER)
            } else {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_OPEN_FILE)
            }
        }
    }

    // http delete a desktop file
    @GetMapping(DELETE_DESKTOP_FILE_URL)
    fun httpDeleteDesktopFile(@RequestParam path: String): ResponseEntity<out CommunicationPackage> {
        val file: File = File(path)

        // File or folder does not exist
        if (!file.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FILE_OR_FOLDER_DOES_NOT_EXIST)
        }

        return if (file.isDirectory) {
            try {
                FileUtils.deleteDirectory(file)
                ResponseEntityManager.get()
            } catch (e: Exception) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_DELETE_FOLDER)
            }
        } else {
            try {
                Files.delete(file.toPath())
                ResponseEntityManager.get()
            } catch (e: Exception) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_DELETE_FILE)
            }
        }
    }
}
