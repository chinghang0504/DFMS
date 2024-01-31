package com.example.spring.controllers

import com.example.spring.managers.ResponseEntityManager
import com.example.spring.managers.URLsManager.Companion.DEVELOPMENT_URL
import com.example.spring.managers.URLsManager.Companion.MODIFY_DESKTOP_FILE_TAGS_URL
import com.example.spring.models.ErrorStatus
import com.example.spring.models.packages.CommunicationPackage
import com.example.spring.models.packages.DesktopFilePackage
import com.example.spring.models.packages.TagsPackage
import com.example.spring.services.DataService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File

@CrossOrigin(DEVELOPMENT_URL)
@RestController
class DataModifyRestController {

    @Autowired
    private lateinit var dataService: DataService

    // Http modify the tags of a desktop file
    @PatchMapping(MODIFY_DESKTOP_FILE_TAGS_URL)
    fun httpModifyDesktopFileTags(@RequestParam path: String, @RequestBody tagsPackage: TagsPackage): ResponseEntity<out CommunicationPackage> {
        val file: File = File(path)

        // File or folder does not exist
        if (!file.exists()) {
            return ResponseEntityManager.get(ErrorStatus.FILE_OR_FOLDER_DOES_NOT_EXIST)
        }

        return try {
            dataService.writeTags(file, tagsPackage.tags)
            ResponseEntityManager.get(DesktopFilePackage(dataService.getDesktopFile(file)))
        } catch (e: Exception) {
            if (file.isDirectory) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_MODIFY_FOLDER_TAGS)
            } else {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_MODIFY_FILE_TAGS)
            }
        }
    }
}
