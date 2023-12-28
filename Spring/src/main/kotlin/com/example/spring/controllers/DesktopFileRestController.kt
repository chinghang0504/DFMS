package com.example.spring.controllers

import com.example.spring.models.DesktopFile
import com.example.spring.models.DesktopFilePackage
import com.example.spring.models.Status
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.net.URLDecoder

@RestController
class DesktopFileRestController {

    @GetMapping("/httpGetDesktopFiles")
    fun httpGetDesktopFiles(@RequestParam path: String?, @RequestParam all: Boolean): ResponseEntity<DesktopFilePackage> {
        val initialFolder: File = File(URLDecoder.decode(path))
        if (!initialFolder.exists()) {
            return ResponseEntity
                .status(Status.FOLDER_DOES_NOT_EXIST.status)
                .header("Access-Control-Allow-Origin", "*")
                .body(DesktopFilePackage(Status.FOLDER_DOES_NOT_EXIST.message, null))
        } else if (!initialFolder.isDirectory) {
            return ResponseEntity
                .status(Status.NOT_A_FOLDER.status)
                .header("Access-Control-Allow-Origin", "*")
                .body(DesktopFilePackage(Status.NOT_A_FOLDER.message, null))
        }

        val desktopFiles: ArrayList<DesktopFile> = ArrayList()
        if (all) {
            getAllDesktopFiles(initialFolder, desktopFiles)
        } else {
            getCurrentDesktopFiles(initialFolder, desktopFiles)
        }

        return ResponseEntity
            .status(HttpStatus.ACCEPTED)
            .header("Access-Control-Allow-Origin", "*")
            .body(DesktopFilePackage(Status.NORMAL.message, desktopFiles))
    }

    private fun getCurrentDesktopFiles(parentFolder: File, desktopFiles: ArrayList<DesktopFile>) {
        parentFolder.listFiles()?.forEach {
            if (it.isDirectory) {
                desktopFiles.add(DesktopFile(it.name, "Folder", it.length()))
            } else {
                desktopFiles.add(DesktopFile(it.name, "File", it.length()))
            }
        }
    }

    private fun getAllDesktopFiles(parentFolder: File, desktopFiles: ArrayList<DesktopFile>) {
        parentFolder.listFiles()?.forEach {
            if (it.isDirectory) {
                getAllDesktopFiles(it, desktopFiles)
            } else {
                desktopFiles.add(DesktopFile(it.name, "File", it.length()))
            }
        }
    }
}