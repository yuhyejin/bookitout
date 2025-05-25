package com.hjeu.bookitout.library_favorite.service;

import com.hjeu.bookitout.library_favorite.domain.LibraryFavorite;
import com.hjeu.bookitout.library_favorite.dto.LibraryFavoriteDTO;
import com.hjeu.bookitout.library_favorite.repository.LibraryFavoriteRepository;
import com.hjeu.bookitout.library_favorite.vo.response.LibraryFavoriteResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Override
    public List<LibraryFavoriteResponseVO> getLibraryFavorite(String userId) {
        List<LibraryFavorite> list = libraryFavoriteRepository.findByUserIdAndStatusTrue(userId);
        return list.stream()
                .map(f -> new LibraryFavoriteResponseVO(f.getLibName(), f.getLibUrl()))
                .toList();
    }

    @Override
    public void deleteFavorite(Long libId, String userId) {
        LibraryFavorite favorite = libraryFavoriteRepository.findByLibIdAndUserId(libId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 즐겨찾기를 찾을 수 없습니다."));
        favorite.deactivate();
        libraryFavoriteRepository.save(favorite);
    }
}
