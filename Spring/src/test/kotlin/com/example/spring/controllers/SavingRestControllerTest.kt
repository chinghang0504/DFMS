package com.example.spring.controllers

import com.example.spring.models.packages.TagsPackage
import com.example.spring.models.packages.SavingPackage
import com.example.spring.models.packages.SettingsPackage
import org.apache.tomcat.util.http.fileupload.FileUtils
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.io.File
import java.lang.reflect.Field
import java.lang.reflect.Method
import java.nio.file.Files

@SpringBootTest
class SavingRestControllerTest {

//    @Test
//    fun test() {
//        val file: File = File("aaaaa")
//        println(file.exists())
//        println(file.isDirectory)
//        println(file.isFile)
//
//        FileUtils.deleteDirectory(file)
//    }
//
//    @Autowired
//    private lateinit var savingRestController: SavingRestController
//    private val DEFAULT_RESULT: SavingPackage = SavingPackage(
//        SettingsPackage("C:\\", false, true),
//        TagsPackage(listOf())
//    )
//
//    @Test
//    fun testSavingFileDefault() {
//        val file: File = File("test_files/test_file_1.json")
//        val exceptedResult: SavingPackage = DEFAULT_RESULT
//
//        assertTrue(file.exists())
//        val result: SavingPackage = generateSavingPackage(file)
//        compareResult(result, exceptedResult)
//    }
//
//    @Test
//    fun testSavingFileNormal() {
//        val file: File = File("test_files/test_file_2.json")
//        val exceptedResult: SavingPackage = SavingPackage(
//            SettingsPackage("C:\\test\\test", true, false),
//            TagsPackage(listOf("CS"))
//        )
//
//        assertTrue(file.exists())
//        val actualResult: SavingPackage = generateSavingPackage(file)
//        compareResult(exceptedResult, actualResult)
//    }
//
//    @Test
//    fun testSavingFileDoesNotExist() {
//        val file: File = File("test_files/test_file_3.json")
//        val exceptedResult: SavingPackage = DEFAULT_RESULT
//
//        assertFalse(file.exists())
//        val result: SavingPackage = generateSavingPackage(file)
//        compareResult(result, exceptedResult)
//    }
//
//    private fun generateSavingPackage(file: File): SavingPackage {
//        val privateMethod: Method = SavingRestController::class.java.getDeclaredMethod("initSavingPackage", File::class.java)
//        privateMethod.isAccessible = true
//        privateMethod.invoke(savingRestController, file)
//
//        val privateField: Field = SavingRestController::class.java.getDeclaredField("savingPackage")
//        privateField.isAccessible = true
//        return privateField.get(savingRestController) as SavingPackage
//    }
//
//    private fun compareResult(exceptedResult: SavingPackage, actualResult: SavingPackage) {
//        assertEquals(exceptedResult.settingsPackage!!.homeFolderPath, actualResult.settingsPackage!!.homeFolderPath)
//        assertEquals(exceptedResult.settingsPackage!!.homeFolderPath, actualResult.settingsPackage!!.homeFolderPath)
//        assertEquals(exceptedResult.settingsPackage!!.showHidden, actualResult.settingsPackage!!.showHidden)
//        assertEquals(exceptedResult.settingsPackage!!.tagRemovalDoubleConfirmation, actualResult.settingsPackage!!.tagRemovalDoubleConfirmation)
//        assertEquals(exceptedResult.tagsPackage!!.tags, actualResult.tagsPackage!!.tags)
//    }
}
