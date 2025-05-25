package com.hjeu.bookitout.library_favorite.repository;

import com.hjeu.bookitout.library_favorite.domain.LibraryFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibraryFavoriteRepository extends JpaRepository<LibraryFavorite, Long> {
    List<LibraryFavorite> findByUserIdAndStatusTrue(String userId);

    Optional<LibraryFavorite> findByLibIdAndUserId(Long libId, String userId);
}
