package com.hjeu.bookitout.library.controller;

import com.hjeu.bookitout.library.domain.Library;
import com.hjeu.bookitout.library.service.LibrarySyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @PatchMapping("/updateCrawlerStatus")
    public ResponseEntity<?> updateCrawlerStatus(@RequestParam String libName,
                                               @RequestParam boolean hasCrawler) {
        try {
            librarySyncService.updateLibraryHasCrawlerStatus(libName, hasCrawler);
            return ResponseEntity.ok(libName + " 도서관의 크롤러 상태가 " + hasCrawler + "로 업데이트되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/requestedLibraries")
    public ResponseEntity<List<Library>> getRequestedLibraries() {
        List<Library> requestedLibraries = librarySyncService.getLibrariesByHasCrawlerStatus(false);
        return ResponseEntity.ok(requestedLibraries);
    }
}
