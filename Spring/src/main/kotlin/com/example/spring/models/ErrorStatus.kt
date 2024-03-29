package com.example.spring.models

import org.springframework.http.HttpStatus

enum class ErrorStatus(

    val status: HttpStatus,
    val message: String
) {
    // General
    FILE_OR_FOLDER_DOES_NOT_EXIST(HttpStatus.BAD_REQUEST, "This file or folder does not exist."),

    // OPEN_DESKTOP_FILE_URL
    UNABLE_TO_OPEN_FILE(HttpStatus.BAD_REQUEST, "Unable to open this file."),
    UNABLE_TO_OPEN_FOLDER(HttpStatus.BAD_REQUEST, "Unable to open this folder."),

    // DELETE_DESKTOP_FILE_URL
    UNABLE_TO_DELETE_FILE(HttpStatus.BAD_REQUEST, "Unable to delete this file."),
    UNABLE_TO_DELETE_FOLDER(HttpStatus.BAD_REQUEST, "Unable to delete this folder."),

    // GET_DESKTOP_FILES_URL
    GET_DESKTOP_FILES_IS_CANCELED(HttpStatus.BAD_REQUEST, "Your request has been canceled."),
    FOLDER_DOES_NOT_EXIST(HttpStatus.BAD_REQUEST, "This folder does not exist."),
    NOT_A_FOLDER(HttpStatus.BAD_REQUEST, "This is not a folder."),

    // MODIFY_DESKTOP_FILE_URL
    UNABLE_TO_MODIFY_FILE_TAGS(HttpStatus.BAD_REQUEST, "Unable to modify the tags of this file."),
    UNABLE_TO_MODIFY_FOLDER_TAGS(HttpStatus.BAD_REQUEST, "Unable to modify the tags of this folder."),

    // SAVE_SETTINGS_URL
    UNABLE_TO_SAVE_SETTINGS(HttpStatus.BAD_REQUEST, "Unable to save the settings."),
    UNABLE_TO_RESET_SETTINGS(HttpStatus.BAD_REQUEST, "Unable to reset the settings."),

    // SAVE_TAGS_URL
    UNABLE_TO_SAVE_TAGS(HttpStatus.BAD_REQUEST, "Unable to save the tags."),
    UNABLE_TO_CLEAR_ALL_TAGS(HttpStatus.BAD_REQUEST, "Unable to clear all the tags.")
}
