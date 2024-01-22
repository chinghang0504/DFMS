package com.example.spring.controllers

import com.example.spring.managers.ResponseEntityManager
import com.example.spring.models.ErrorStatus
import com.example.spring.models.SettingsPackage
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.File
import java.nio.file.Files
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

private const val LOAD_SETTINGS_URL: String = "/loadSettings";
private const val SAVE_SETTINGS_URL: String = "/saveSettings";

private const val SETTINGS_FILE_NAME: String = "setting.json";

private const val DEFAULT_HOME_FOLDER_PATH: String = "C:\\";
private const val DEFAULT_SHOW_HIDDEN: Boolean = false;
private const val DEFAULT_REMOVE_DOUBLE_CONFIRMATION: Boolean = true;

@RestController
class SettingsRestController {

    private var settingsPackage: SettingsPackage? = null
    private val lock: ReentrantLock = ReentrantLock()
    private val DEFAULT_SETTINGS_PACKAGE: SettingsPackage = SettingsPackage(DEFAULT_HOME_FOLDER_PATH, DEFAULT_SHOW_HIDDEN, DEFAULT_REMOVE_DOUBLE_CONFIRMATION)

    // Http load the settings
    @GetMapping(LOAD_SETTINGS_URL)
    fun httpLoadSettings(): ResponseEntity<*> {
        loadSettings()

        return ResponseEntityManager.get(settingsPackage!!)
    }

    // Load settings
    private fun loadSettings() {
        lock.withLock {
            if (settingsPackage == null) {
                val file: File = File(SETTINGS_FILE_NAME)

                settingsPackage = try {
                    if (file.exists()) {
                        Gson().fromJson(file.readText(), SettingsPackage::class.java)
                    } else {
                        throw Exception()
                    }
                } catch (e: Exception) {
                    DEFAULT_SETTINGS_PACKAGE
                }
            }
        }
    }

    // Http save the settings
    @PostMapping(SAVE_SETTINGS_URL)
    fun httpSaveSettings(@RequestBody settingsPackage: SettingsPackage?): ResponseEntity<*> {
        val file: File = File(SETTINGS_FILE_NAME)

        if (settingsPackage == null) {
            return try {
                lock.withLock {
                    Files.delete(file.toPath())
                    this.settingsPackage = DEFAULT_SETTINGS_PACKAGE
                }
                ResponseEntityManager.get(this.settingsPackage!!)
            } catch (e: Exception) {
                ResponseEntityManager.get(ErrorStatus.UNABLE_TO_RESET_SETTINGS)
            }
        }

        return try {
            lock.withLock {
                val gson: Gson = GsonBuilder().setPrettyPrinting().create()
                file.writeText(gson.toJson(settingsPackage))
                this.settingsPackage = settingsPackage
            }

            ResponseEntityManager.get()
        } catch (e: Exception) {
            ResponseEntityManager.get(ErrorStatus.UNABLE_TO_SAVE_SETTINGS)
        }
    }
}
