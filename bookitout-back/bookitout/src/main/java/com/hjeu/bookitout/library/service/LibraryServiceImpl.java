package com.hjeu.bookitout.library.service;

import com.hjeu.bookitout.library.domain.Library;
import com.hjeu.bookitout.library.repository.LibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;

    @Autowired
    public LibraryServiceImpl(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    @Override
    public List<Library> searchLibrariesByLibName(String libName) {
        return libraryRepository.findByLibNameContainingIgnoreCase(libName);
    }
}
