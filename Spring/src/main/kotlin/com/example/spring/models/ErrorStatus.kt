package com.example.spring.models

import org.springframework.http.HttpStatus

enum class ErrorStatus(val status: HttpStatus, val message: String) {

    FOLDER_DOES_NOT_EXIST(HttpStatus.BAD_REQUEST, "This folder does not exist."),
    NOT_A_FOLDER(HttpStatus.BAD_REQUEST, "This is not a folder."),
    UNABLE_TO_OPEN_FILE(HttpStatus.BAD_REQUEST, "Unable to open this file."),
}
