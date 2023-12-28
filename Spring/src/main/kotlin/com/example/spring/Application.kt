package com.example.spring

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.runApplication

@SpringBootApplication
class Application

fun main(args: Array<String>) {
//    runApplication<Application>(*args)
    SpringApplicationBuilder(Application::class.java).headless(false).run(*args)
}
