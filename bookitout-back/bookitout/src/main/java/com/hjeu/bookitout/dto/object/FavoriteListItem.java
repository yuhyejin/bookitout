package com.hjeu.bookitout.dto.object;

import jdk.jfr.Name;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteListItem {

    private int favoriteNumber;
    private int libraryNumber;
    private String libraryName;
    private String libraryUrl;
    private String userId;
}
