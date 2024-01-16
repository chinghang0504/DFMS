package com.example.spring

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import java.awt.BorderLayout
import java.awt.Desktop
import java.awt.Font
import java.net.URI
import javax.swing.JFrame
import javax.swing.JLabel
import javax.swing.SwingConstants


@SpringBootApplication
class Application

fun setUI() {
    val frame: JFrame = JFrame("DFMS")
    frame.setSize(300, 200)
    frame.isVisible = true
    frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE

    val label: JLabel = JLabel("DFMS", SwingConstants.CENTER)
    label.setFont(Font("Serif", Font.PLAIN, 28))
    frame.add(label, BorderLayout.CENTER)
}

fun main(args: Array<String>) {
    SpringApplicationBuilder(Application::class.java).headless(false).run(*args)

    setUI()

    Desktop.getDesktop().browse(URI("http://localhost:8080/"))
}

