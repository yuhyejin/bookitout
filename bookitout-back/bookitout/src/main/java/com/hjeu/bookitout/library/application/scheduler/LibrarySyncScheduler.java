package com.hjeu.bookitout.library.application.scheduler;

import com.hjeu.bookitout.library.service.LibrarySyncService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LibrarySyncScheduler {

    private final LibrarySyncService librarySyncService;

    @Autowired
    public LibrarySyncScheduler(LibrarySyncService librarySyncService) {
        this.librarySyncService = librarySyncService;
    }

    @Scheduled(cron = "0 0 0 1 * ?")    // 매월 1일 자정
    public void autoSyncLibraryData() {
        log.info("도서관 정보 스케줄러 시작");
        librarySyncService.syncLibraryData();
        log.info("도서관 정보 스케줄러 끝");
    }
}
