package com.hjeu.bookitout.book_search.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookSearchDTO {
    private String title;
    private String loan;
    private String author;
    private String publisher;
    private String shelf_loc;
    private String interlibrary;
    private String return_date;
    private String reservation;
    private String libraryName;
    private String image_url;
}
