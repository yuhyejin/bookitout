package com.hjeu.bookitout.LibraryFavorite.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "library_favorite")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long libId;

    @Column(name = "lib_name", nullable = false)
    private String libName;

    @Column(name = "lib_url", nullable = false)
    private String libUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
