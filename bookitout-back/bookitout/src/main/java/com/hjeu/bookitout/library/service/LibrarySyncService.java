package com.hjeu.bookitout.library.service;

import com.hjeu.bookitout.library.domain.Library;
import java.util.List;

public interface LibrarySyncService {
    void syncLibraryData();
    void updateLibraryHasCrawlerStatus(String libName, boolean hasCrawler);
    List<Library> getLibrariesByHasCrawlerStatus(boolean hasCrawler);
}
