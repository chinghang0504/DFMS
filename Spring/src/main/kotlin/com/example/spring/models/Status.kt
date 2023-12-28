package com.example.spring.models

enum class Status(val status: Int, val message: String) {

    FOLDER_DOES_NOT_EXIST(400,"This folder does not exist"),
    NOT_A_FOLDER(400,"This is not a folder"),
    NORMAL(200, "Normal")
}