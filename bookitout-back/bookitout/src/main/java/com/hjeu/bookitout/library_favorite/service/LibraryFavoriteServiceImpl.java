package com.hjeu.bookitout.library_favorite.service;

import com.hjeu.bookitout.library_favorite.domain.LibraryFavorite;
import com.hjeu.bookitout.library_favorite.dto.LibraryFavoriteDTO;
import com.hjeu.bookitout.library_favorite.repository.LibraryFavoriteRepository;
import com.hjeu.bookitout.library_favorite.vo.response.LibraryFavoriteResponseVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
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
                .map(f -> new LibraryFavoriteResponseVO(f.getLibId(), f.getLibName(), f.getLibUrl()))
                .toList();
    }

    @Override
    public void deleteFavorite(Long libId, String userId) {
        LibraryFavorite favorite = libraryFavoriteRepository.findByLibIdAndUserId(libId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 즐겨찾기를 찾을 수 없습니다."));
        favorite.deactivate();
        libraryFavoriteRepository.save(favorite);
    }

    // 사용자 ID로 즐겨찾기 도서관 이름 조회
    @Override
    public List<String> getFavoriteLibraryNames(String userId) {
        log.info("userId: {}", userId);
        return libraryFavoriteRepository.findLibNamesByUserId(userId);
    }
}
