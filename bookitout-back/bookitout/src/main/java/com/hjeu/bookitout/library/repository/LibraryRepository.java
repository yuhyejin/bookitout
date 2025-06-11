package com.hjeu.bookitout.library.repository;

import com.hjeu.bookitout.library.domain.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibraryRepository extends JpaRepository<Library, String> {
    List<Library> findByLibNameContainingIgnoreCase(String libName);

    Optional<Library> findByLibCode(String libCode);

    Optional<Library> findByLibName(String libName);

    List<Library> findByHasCrawler(boolean hasCrawler);
}
