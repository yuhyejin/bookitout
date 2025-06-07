package com.hjeu.bookitout.book_search.service;

import com.hjeu.bookitout.book_search.dto.BookSearchDTO;
import com.hjeu.bookitout.library_favorite.service.LibraryFavoriteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookSearchServiceImpl implements BookSearchService {

    @Value("${crawler.api.url}")
    private String crawlerApiUrl;

    private final WebClient libraryCrawlerWebClient;
    private final LibraryFavoriteService libraryFavoriteService;

    @Autowired
    public BookSearchServiceImpl(@Qualifier("libraryCrawlerApiWebClient") WebClient libraryCrawlerWebClient, LibraryFavoriteService libraryFavoriteService) {
        this.libraryCrawlerWebClient = libraryCrawlerWebClient;
        this.libraryFavoriteService = libraryFavoriteService;
    }

    @Override
    public List<BookSearchDTO> searchFromMyLibraries(String userId, String title) {
        List<String> libraryNames = libraryFavoriteService.getFavoriteLibraryNames(userId);
        log.info("libraryNames: {}", libraryNames);
        List<Mono<List<BookSearchDTO>>> tasks = libraryNames.stream()
                .map(libName -> crawlFromSingleLibrary(libName, title))
                .collect(Collectors.toList());
        
        return Flux.merge(tasks)
                .flatMap(Flux::fromIterable)
                .collectList()
                .block();
    }

    private Mono<List<BookSearchDTO>> crawlFromSingleLibrary(String libName, String title) {
        String url = String.format("%s/crawl?library=%s&title=%s", crawlerApiUrl, libName, title);

        log.info("url: {}", url);
        return libraryCrawlerWebClient.get()
                .uri(url)
                .retrieve()
                .bodyToFlux(BookSearchDTO.class)
                .map(dto -> {
                    dto.setLibraryName(libName);
                    return dto;
                })
                .collectList()
                .onErrorReturn(Collections.emptyList());
    }
}
