package com.example.spring.managers

import com.example.spring.models.*
import com.example.spring.models.packages.CommunicationPackage
import com.example.spring.models.packages.ErrorPackage
import org.springframework.http.ResponseEntity

class ResponseEntityManager {

    companion object {
        // Get a communication package
        fun get(): ResponseEntity<CommunicationPackage> {
            return ResponseEntity
                .accepted()
                .build()
        }

        // Get an error package
        fun get(errorStatus: ErrorStatus): ResponseEntity<ErrorPackage> {
            return ResponseEntity
                .status(errorStatus.status)
                .body(ErrorPackage(errorStatus.message))
        }

        // Get a communication package
        fun<T: CommunicationPackage> get(communicationPackage: T): ResponseEntity<T> {
            return ResponseEntity
                .accepted()
                .body(communicationPackage)
        }
    }
}
