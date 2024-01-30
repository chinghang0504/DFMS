package com.example.spring.controllers

import com.example.spring.managers.KeysManager.Companion.SAVING_FILENAME
import com.example.spring.managers.ResponseEntityManager
import com.example.spring.managers.URLsManager.Companion.DEVELOPMENT_URL
import com.example.spring.managers.URLsManager.Companion.LOAD_SAVING_URL
import com.example.spring.managers.URLsManager.Companion.SAVE_SETTINGS_URL
import com.example.spring.managers.URLsManager.Companion.SAVE_TAGS_URL
import com.example.spring.models.*
import com.example.spring.models.packages.CommunicationPackage
import com.example.spring.models.packages.TagsPackage
import com.example.spring.models.packages.SavingPackage
import com.example.spring.models.packages.SettingsPackage
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.File
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.concurrent.read
import kotlin.concurrent.write

@CrossOrigin(DEVELOPMENT_URL)
@RestController
class SavingRestController {

    private lateinit var savingPackage: SavingPackage
    private val reentrantReadWriteLock: ReentrantReadWriteLock = ReentrantReadWriteLock()

    // Constructor
    private constructor() {
        initSavingPackage(File(SAVING_FILENAME))
    }

    // Initialize the saving package
    private fun initSavingPackage(file: File) {
        reentrantReadWriteLock.write {
            savingPackage = try {
                if (file.exists()) {
                    Gson().fromJson(file.readText(), SavingPackage::class.java)
                } else {
                    SavingPackage()
                }
            } catch (e: Exception) {
                SavingPackage()
            }
        }
    }

    // Http load the saving
    @GetMapping(LOAD_SAVING_URL)
    fun httpLoadSaving(): ResponseEntity<SavingPackage> {
        return ResponseEntityManager.get(reentrantReadWriteLock.read { savingPackage })
    }

    // Http save the settings
    @PostMapping(SAVE_SETTINGS_URL)
    fun httpSaveSettings(@RequestBody settingsPackage: SettingsPackage?): ResponseEntity<out CommunicationPackage> {
        val file: File = File(SAVING_FILENAME)
        val gson: Gson = GsonBuilder().setPrettyPrinting().create()
        val newSettingsPackage: SettingsPackage = settingsPackage ?: SettingsPackage()

        return try {
            reentrantReadWriteLock.write {
                val newSavingPackage: SavingPackage = this.savingPackage.copy(settingsPackage = newSettingsPackage)
                file.writeText(gson.toJson(newSavingPackage))
                this.savingPackage = newSavingPackage
            }
            ResponseEntityManager.get(newSettingsPackage)
        } catch (e: Exception) {
            if (settingsPackage != null) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_SAVE_SETTINGS)
            } else {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_RESET_SETTINGS)
            }
        }
    }

    // Http save the tags
    @PostMapping(SAVE_TAGS_URL)
    fun httpSaveTags(@RequestBody tagsPackage: TagsPackage?): ResponseEntity<out CommunicationPackage> {
        val file: File = File(SAVING_FILENAME)
        val gson: Gson = GsonBuilder().setPrettyPrinting().create()
        val newTagsPackage: TagsPackage = tagsPackage ?: TagsPackage()

        return try {
            reentrantReadWriteLock.write {
                val newSavingPackage: SavingPackage = this.savingPackage.copy(tagsPackage = newTagsPackage)
                file.writeText(gson.toJson(newSavingPackage))
                this.savingPackage = newSavingPackage
            }
            ResponseEntityManager.get()
        } catch (e: Exception) {
            if (tagsPackage != null) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_SAVE_TAGS)
            } else {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_CLEAR_ALL_TAGS)
            }
        }
    }
}
