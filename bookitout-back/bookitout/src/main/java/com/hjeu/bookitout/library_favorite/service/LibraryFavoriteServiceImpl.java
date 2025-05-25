package com.hjeu.bookitout.library_favorite.service;

import com.hjeu.bookitout.library_favorite.domain.LibraryFavorite;
import com.hjeu.bookitout.library_favorite.dto.LibraryFavoriteDTO;
import com.hjeu.bookitout.library_favorite.repository.LibraryFavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LibraryFavoriteServiceImpl implements LibraryFavoriteService {

    private final LibraryFavoriteRepository libraryFavoriteRepository;

    @Autowired
    public LibraryFavoriteServiceImpl(LibraryFavoriteRepository libraryFavoriteRepository) {
        this.libraryFavoriteRepository = libraryFavoriteRepository;
    }

    @Override
    public void addFavoriteLibrary(LibraryFavoriteDTO dto) {
        LibraryFavorite favorite = LibraryFavorite.builder()
                .userId(dto.getUserId())
                .libName(dto.getLibName())
                .libUrl(dto.getLibUrl())
                .status(true)
                .build();
        libraryFavoriteRepository.save(favorite);
    }
}
