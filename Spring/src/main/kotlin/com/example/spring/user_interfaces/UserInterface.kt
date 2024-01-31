package com.example.spring.user_interfaces

import com.example.spring.managers.KeysManager.Companion.PROJECT_NAME
import java.awt.BorderLayout
import java.awt.Font
import javax.swing.JFrame
import javax.swing.JLabel
import javax.swing.SwingConstants

class UserInterface {

    private val frame: JFrame = JFrame(PROJECT_NAME)
    private val titleLabel: JLabel = JLabel(PROJECT_NAME, SwingConstants.CENTER)

    // Init
    init {
        frame.setSize(300, 200)
        frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
        frame.isVisible = true

        titleLabel.setFont(Font(null, Font.PLAIN, 28))
        frame.add(titleLabel, BorderLayout.CENTER)
    }
}
