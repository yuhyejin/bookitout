package com.hjeu.bookitout.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BookListItem {
    private int bookNumber;
    private String title;
    private String author;
    private String collLibrary;
    private String isBookLoan;
    private String returnDate;
}
