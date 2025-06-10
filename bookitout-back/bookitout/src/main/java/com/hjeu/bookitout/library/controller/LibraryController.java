package com.hjeu.bookitout.library.controller;

import com.hjeu.bookitout.library.domain.Library;
import com.hjeu.bookitout.library.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/libraries")
public class LibraryController {

    private final LibraryService libraryService;

    @Autowired
    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Library>> search(@RequestParam("libName") String libName) {
        return ResponseEntity.ok(libraryService.searchLibrariesByLibName(libName));
    }
}
