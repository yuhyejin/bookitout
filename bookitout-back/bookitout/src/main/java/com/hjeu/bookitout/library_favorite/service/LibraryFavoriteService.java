package com.hjeu.bookitout.library_favorite.service;

import com.hjeu.bookitout.library_favorite.dto.LibraryFavoriteDTO;
import com.hjeu.bookitout.library_favorite.vo.response.LibraryFavoriteResponseVO;

import java.util.List;

public interface LibraryFavoriteService {
    boolean addFavoriteLibrary(LibraryFavoriteDTO dto);

    List<LibraryFavoriteResponseVO> getLibraryFavorite(String userId);

    void deleteFavorite(Long libId, String userId);

    // 사용자 ID로 즐겨찾기 도서관 이름 조회
    List<String> getFavoriteLibraryNames(String userId);
}
