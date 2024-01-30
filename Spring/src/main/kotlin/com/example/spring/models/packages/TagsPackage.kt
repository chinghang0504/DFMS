package com.example.spring.models.packages

import com.google.gson.annotations.SerializedName

private val DEFAULT_TAGS: List<String> = listOf()

data class TagsPackage(

    @SerializedName("tags")
    var tags: List<String> = DEFAULT_TAGS
): CommunicationPackage()
