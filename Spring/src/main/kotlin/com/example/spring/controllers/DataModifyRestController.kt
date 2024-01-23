package com.example.spring.controllers

import com.example.spring.managers.ResponseEntityManager
import com.example.spring.models.ErrorStatus
import com.google.gson.Gson
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.nio.ByteBuffer
import java.nio.file.Files
import java.nio.file.attribute.UserDefinedFileAttributeView

private const val MODIFY_DESKTOP_FILE_URL: String = "/modifyDesktopFile"

@CrossOrigin("http://localhost:4200")
@RestController
class DataModifyRestController {

    // Http modify a desktop file
    @GetMapping(MODIFY_DESKTOP_FILE_URL)
    fun httpModifyDesktopFile(@RequestParam path: String, @RequestParam(required = false) tags: List<String>?): ResponseEntity<*> {
        val file: File = File(path)

        // File or folder does not exist
        if (!file.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FILE_OR_FOLDER_DOES_NOT_EXIST)
        }

        return try {
            writeTags(file, tags)
            ResponseEntityManager.get()
        } catch (e: Exception) {
            if (file.isDirectory) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_MODIFY_FOLDER_TAGS)
            } else {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_MODIFY_FILE_TAGS)
            }
        }
    }

    // Write tags into a desktop file
    private fun writeTags(file: File, tags: List<String>?) {
        val userView: UserDefinedFileAttributeView = Files.getFileAttributeView(file.toPath(), UserDefinedFileAttributeView::class.java)
        val byteArray: ByteArray = Gson().toJson(tags).toByteArray()
        userView.write(TAGS_KEY, ByteBuffer.wrap(byteArray))
    }
}
