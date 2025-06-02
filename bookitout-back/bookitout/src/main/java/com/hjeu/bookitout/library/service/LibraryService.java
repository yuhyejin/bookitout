package com.hjeu.bookitout.library.service;

import com.hjeu.bookitout.library.domain.Library;

import java.util.List;

public interface LibraryService {
    List<Library> searchLibrariesByLibName(String libName);
}
