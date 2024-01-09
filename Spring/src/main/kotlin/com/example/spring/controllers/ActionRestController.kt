package com.example.spring.controllers

import com.example.spring.models.ErrorStatus
import com.example.spring.managers.ResponseEntityManager
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.awt.Desktop
import java.io.File
import java.nio.file.Files
import kotlin.io.path.Path

private const val OPEN_DESKTOP_FILE_URL: String = "/openDesktopFile";
private const val DELETE_DESKTOP_FILE_URL: String = "/deleteDesktopFile";

@RestController
class ActionRestController {

    // Open the file
    @GetMapping(OPEN_DESKTOP_FILE_URL)
    fun openDesktopFile(@RequestParam path: String): ResponseEntity<*> {
        return try {
            Desktop.getDesktop().open(File(path))
            ResponseEntityManager.get()
        } catch (e: Exception) {
            ResponseEntityManager.get(ErrorStatus.UNABLE_TO_OPEN_FILE)
        }
    }

    // Delete the file
    @GetMapping(DELETE_DESKTOP_FILE_URL)
    fun deleteDesktopFile(@RequestParam path: String): ResponseEntity<*> {
        return try {
            Files.delete(Path(path))
            ResponseEntityManager.get()
        } catch (e: Exception) {
            ResponseEntityManager.get(ErrorStatus.UNABLE_TO_DELETE_FILE)
        }
    }
}