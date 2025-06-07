package com.hjeu.bookitout.book_search.service;

import com.hjeu.bookitout.book_search.dto.BookSearchDTO;

import java.util.List;

public interface BookSearchService {
    List<BookSearchDTO> searchFromMyLibraries(String userId, String title);
}
