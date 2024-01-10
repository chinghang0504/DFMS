package com.example.spring

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import java.awt.BorderLayout
import java.awt.Desktop
import java.awt.event.ActionEvent
import java.awt.event.ActionListener
import java.net.URI
import javax.swing.JButton
import javax.swing.JFrame
import javax.swing.JLabel

@SpringBootApplication
class Application

fun main(args: Array<String>) {
    SpringApplicationBuilder(Application::class.java).headless(false).run(*args)

    val frame: JFrame = JFrame("DFMS")
    frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
    frame.setSize(300, 200)
    frame.isVisible = true

    val label: JLabel = JLabel("DFMS")
    frame.add(label, BorderLayout.NORTH)

    val openButton: JButton = JButton("Open Browser")
    frame.add(openButton, BorderLayout.CENTER)
    openButton.addActionListener(object: ActionListener {

        override fun actionPerformed(e: ActionEvent?) {
            Desktop.getDesktop().browse(URI("http://localhost:4200/"))
        }
    })
}
