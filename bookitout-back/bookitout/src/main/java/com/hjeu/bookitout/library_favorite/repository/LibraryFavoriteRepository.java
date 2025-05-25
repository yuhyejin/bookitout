package com.hjeu.bookitout.library_favorite.repository;

import com.hjeu.bookitout.library_favorite.domain.LibraryFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryFavoriteRepository extends JpaRepository<LibraryFavorite, Long> {
}
