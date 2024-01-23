package com.example.spring.user_interfaces

import java.awt.BorderLayout
import java.awt.Font
import javax.swing.JFrame
import javax.swing.JLabel
import javax.swing.SwingConstants

class UserInterface {

    val title: String = "DFMS"

    val frame: JFrame
    val titleLabel: JLabel

    // Constructor
    constructor() {
        frame = JFrame(title)
        frame.setSize(300, 200)
        frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
        frame.isVisible = true

        titleLabel = JLabel(title, SwingConstants.CENTER)
        titleLabel.setFont(Font(null, Font.PLAIN, 28))
        frame.add(titleLabel, BorderLayout.CENTER)
    }
}
