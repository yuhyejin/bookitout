package com.hjeu.bookitout.library_favorite.vo.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryFavoriteRequestVO {
    private String libName;
    private String libUrl;
}
