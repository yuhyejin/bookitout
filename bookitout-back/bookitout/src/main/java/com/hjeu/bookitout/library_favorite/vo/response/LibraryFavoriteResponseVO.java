package com.hjeu.bookitout.library_favorite.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LibraryFavoriteResponseVO {
    private Long libId;
    private String libName;
    private String libUrl;
}
