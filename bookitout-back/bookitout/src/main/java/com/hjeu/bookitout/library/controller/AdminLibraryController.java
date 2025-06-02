package com.hjeu.bookitout.library.controller;

import com.hjeu.bookitout.library.service.LibrarySyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/library")
public class AdminLibraryController {

    private final LibrarySyncService librarySyncService;

    @Autowired
    public AdminLibraryController(LibrarySyncService librarySyncService) {
        this.librarySyncService = librarySyncService;
    }

    @PostMapping("/sync")
    public ResponseEntity<?> manualSync() {
        librarySyncService.syncLibraryData();
        return ResponseEntity.ok("동기화 완료");
    }
}
