package com.hjeu.bookitout.library.application.scheduler;

import com.hjeu.bookitout.library.service.LibrarySyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LibrarySyncScheduler {

    private final LibrarySyncService librarySyncService;

    @Autowired
    public LibrarySyncScheduler(LibrarySyncService librarySyncService) {
        this.librarySyncService = librarySyncService;
    }
}
