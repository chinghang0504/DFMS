package com.example.spring.models

data class FileTagsPackage(

    val fileTags: List<String>
) {
    companion object {
        fun getDefault(): FileTagsPackage = FileTagsPackage(listOf())
    }
}
