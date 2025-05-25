package com.hjeu.bookitout.library_favorite.service;

import com.hjeu.bookitout.library_favorite.dto.LibraryFavoriteDTO;
import com.hjeu.bookitout.library_favorite.vo.response.LibraryFavoriteResponseVO;

import java.util.List;

public interface LibraryFavoriteService {
    void addFavoriteLibrary(LibraryFavoriteDTO dto);

    List<LibraryFavoriteResponseVO> getLibraryFavorite(String userId);
}
