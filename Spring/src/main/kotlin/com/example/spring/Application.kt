package com.example.spring

import com.example.spring.user_interfaces.UserInterface
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.context.annotation.Bean
import java.awt.Desktop
import java.net.URI

@SpringBootApplication
class Application {

    @Bean
    fun applicationRunner(): ApplicationRunner {
        return ApplicationRunner {
            // Open the browser
            Desktop.getDesktop().browse(URI("http://localhost:8080/"))
        }
    }

    companion object {

        @JvmStatic
        fun main(args: Array<String>) {
            // Start a Spring
            SpringApplicationBuilder(Application::class.java).headless(false).run(*args)

            // Start a UI
            UserInterface()
        }
    }
}
