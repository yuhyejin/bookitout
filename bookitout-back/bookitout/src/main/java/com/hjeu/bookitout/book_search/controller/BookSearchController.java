package com.hjeu.bookitout.book_search.controller;

import com.hjeu.bookitout.book_search.dto.BookSearchDTO;
import com.hjeu.bookitout.book_search.service.BookSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/book-search")
public class BookSearchController {

    private final BookSearchService bookSearchService;

    @Autowired
    public BookSearchController(BookSearchService bookSearchService) {
        this.bookSearchService = bookSearchService;
    }

    @GetMapping("")
    public List<BookSearchDTO> searchBook(@RequestParam String title,
                                          @AuthenticationPrincipal String userId) {
        return bookSearchService.searchFromMyLibraries(userId, title);
    }

}
