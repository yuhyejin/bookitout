package com.hjeu.bookitout.library_favorite.controller;

import com.hjeu.bookitout.library_favorite.dto.LibraryFavoriteDTO;
import com.hjeu.bookitout.library_favorite.service.LibraryFavoriteService;
import com.hjeu.bookitout.library_favorite.vo.request.LibraryFavoriteRequestVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/library")
public class LibraryFavoriteController {

    private final LibraryFavoriteService libraryFavoriteService;

    @Autowired
    public LibraryFavoriteController(LibraryFavoriteService libraryFavoriteService) {
        this.libraryFavoriteService = libraryFavoriteService;
    }

    @PostMapping("/favorite")
    public ResponseEntity<?> addLibraryFavorite(@RequestBody LibraryFavoriteRequestVO request,
                                                @AuthenticationPrincipal String userId) {
        LibraryFavoriteDTO dto = LibraryFavoriteDTO.builder()
                        .userId(userId)
                        .libName(request.getLibName())
                        .libUrl(request.getLibUrl())
                        .build();
        libraryFavoriteService.addFavoriteLibrary(dto);
        return ResponseEntity.ok("도서관 즐겨찾기 등록 완료");
    }
}
