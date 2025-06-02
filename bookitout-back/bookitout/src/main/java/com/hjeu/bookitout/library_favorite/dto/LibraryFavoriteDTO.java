package com.hjeu.bookitout.library_favorite.dto;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class LibraryFavoriteDTO {
    private Long libId;
    private String libName;
    private String libUrl;
    private LocalDateTime createdAt;
    private String userId;
}
