package com.hjeu.bookitout.library_favorite.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_lib_favorite")
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

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.status = false;
    }
}
