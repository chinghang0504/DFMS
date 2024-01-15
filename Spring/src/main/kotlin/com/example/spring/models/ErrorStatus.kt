package com.example.spring.models

import org.springframework.http.HttpStatus

enum class ErrorStatus(val status: HttpStatus, val message: String) {

    FOLDER_DOES_NOT_EXIST(HttpStatus.BAD_REQUEST, "This folder does not exist."),
    NOT_A_FOLDER(HttpStatus.BAD_REQUEST, "This is not a folder."),
    GET_DESKTOP_FILE_PACKAGE_IS_TERMINATED(HttpStatus.BAD_REQUEST, "Your HTTP GET request has been canceled."),

    UNABLE_TO_OPEN_FILE(HttpStatus.BAD_REQUEST, "Unable to open this file."),

    UNABLE_TO_DELETE_FILE(HttpStatus.BAD_REQUEST, "Unable to delete this file."),

    FILE_DOES_NOT_EXIST(HttpStatus.BAD_REQUEST, "This file does not exist."),

    UNABLE_TO_CHANGE_TAGS(HttpStatus.BAD_REQUEST, "Unable to change the tags.")
}
