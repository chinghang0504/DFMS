package com.example.spring.models.comparators

import com.example.spring.models.DesktopFile
import com.example.spring.models.FOLDER_DESKTOP_FILE_TYPE

class DesktopFileComparator {

    companion object: Comparator<DesktopFile> {

        override fun compare(o1: DesktopFile, o2: DesktopFile): Int {
            return if (o1.type == FOLDER_DESKTOP_FILE_TYPE && o2.type == FOLDER_DESKTOP_FILE_TYPE) {
                o1.name.compareTo(o2.name, true)
            } else if (o1.type == FOLDER_DESKTOP_FILE_TYPE) {
                -1
            } else if (o2.type == FOLDER_DESKTOP_FILE_TYPE) {
                1
            } else {
                o1.name.compareTo(o2.name, true)
            }
        }
    }
}