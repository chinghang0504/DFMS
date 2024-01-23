package com.example.spring.controllers

import com.example.spring.managers.ResponseEntityManager
import com.example.spring.models.*
import com.example.spring.packages.FileTagsPackage
import com.example.spring.packages.SavingPackage
import com.example.spring.packages.SettingsPackage
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.File
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

private const val LOAD_SAVING_URL: String = "/loadSaving"
private const val SAVE_SETTINGS_URL: String = "/saveSettings"
private const val SAVE_FILE_TAGS_URL: String = "/saveFileTags"

private const val SAVING_FILE_NAME: String = "saving.json"

private val DEFAULT_SAVING_PACKAGE: SavingPackage = SavingPackage(SettingsPackage.getDefault(), FileTagsPackage.getDefault())

@CrossOrigin("http://localhost:4200")
@RestController
class SavingRestController {

    private var savingPackage: SavingPackage
    private val lock: ReentrantLock = ReentrantLock()

    // Constructor
    constructor() {
        val file: File = File(SAVING_FILE_NAME)
        lock.withLock {
            savingPackage = try {
                if (file.exists()) {
                    Gson().fromJson(file.readText(), SavingPackage::class.java)
                } else {
                    DEFAULT_SAVING_PACKAGE
                }
            } catch (e: Exception) {
                DEFAULT_SAVING_PACKAGE
            }
        }
    }

    // Http load the saving
    @GetMapping(LOAD_SAVING_URL)
    fun httpLoadSaving(): ResponseEntity<*> {
        return ResponseEntityManager.get(lock.withLock { savingPackage })
    }

    // Http save the settings
    @PostMapping(SAVE_SETTINGS_URL)
    fun httpSaveSettings(@RequestBody settingsPackage: SettingsPackage?): ResponseEntity<*> {
        return try {
            val file: File = File(SAVING_FILE_NAME)
            val newSettingsPackage: SettingsPackage = settingsPackage ?: SettingsPackage.getDefault()
            val gson: Gson = GsonBuilder().setPrettyPrinting().create()
            lock.withLock {
                val savingPackage: SavingPackage = this.savingPackage.copy(settingsPackage = newSettingsPackage)
                file.writeText(gson.toJson(savingPackage))
                this.savingPackage = savingPackage
            }
            ResponseEntityManager.get(newSettingsPackage)
        } catch (e: Exception) {
            val errorStatus: ErrorStatus = if (settingsPackage != null) {
                ErrorStatus.UNABLE_TO_SAVE_SETTINGS
            } else {
                ErrorStatus.UNABLE_TO_RESET_SETTINGS
            }
            ResponseEntityManager.get(errorStatus)
        }
    }

    // Http save the file tags
    @PostMapping(SAVE_FILE_TAGS_URL)
    fun httpSaveFileTags(@RequestBody fileTagsPackage: FileTagsPackage?): ResponseEntity<*> {
        return try {
            val file: File = File(SAVING_FILE_NAME)
            val newFileTagsPackage: FileTagsPackage = fileTagsPackage ?: FileTagsPackage.getDefault()
            val gson: Gson = GsonBuilder().setPrettyPrinting().create()
            lock.withLock {
                val savingPackage: SavingPackage = this.savingPackage.copy(fileTagsPackage = newFileTagsPackage)
                file.writeText(gson.toJson(savingPackage))
                this.savingPackage = savingPackage
            }
            ResponseEntityManager.get(newFileTagsPackage)
        } catch (e: Exception) {
            val errorStatus: ErrorStatus = if (fileTagsPackage != null) {
                ErrorStatus.UNABLE_TO_SAVE_FILE_TAGS
            } else {
                ErrorStatus.UNABLE_TO_CLEAR_ALL_FILE_TAGS
            }
            ResponseEntityManager.get(errorStatus)
        }
    }
}
