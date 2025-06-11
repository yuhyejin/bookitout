package com.hjeu.bookitout.library.service;

import com.hjeu.bookitout.library.domain.Library;
import com.hjeu.bookitout.library.dto.LibraryOpenApiResponse;
import com.hjeu.bookitout.library.repository.LibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibrarySyncServiceImpl implements LibrarySyncService {

    private final LibraryRepository libraryRepository;
    private final WebClient webClient;

    @Value("${library.api.key}")
    private String apiKey;

    @Autowired
    public LibrarySyncServiceImpl(LibraryRepository libraryRepository, @Qualifier("libraryApiWebClient") WebClient webClient) {
        this.libraryRepository = libraryRepository;
        this.webClient = webClient;
    }

    public List<Library> fetchLibrariesFromOpenAPI() {
        String url = "http://data4library.kr/api/libSrch?authKey=" + apiKey + "&pageNo=1&pageSize=1600&format=json";

        LibraryOpenApiResponse response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(LibraryOpenApiResponse.class)
                .block();

        return response.getLibs()
                .stream()
                .map(Library::fromOpenApi)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void syncLibraryData() {
        List<Library> libraries = fetchLibrariesFromOpenAPI();
        for (Library lib : libraries) {
            libraryRepository.findByLibCode(lib.getLibCode())
                    .ifPresentOrElse(
                            existing -> {
                                if (!existing.equals(lib)) {
                                    existing.updateFrom(lib); // 필드 값만 수정
                                }
                            },
                            () -> libraryRepository.save(lib) // 새로 추가
                    );
        }
    }

    @Transactional
    @Override
    public void updateLibraryHasCrawlerStatus(String libName, boolean hasCrawler) {
        Library library = libraryRepository.findByLibName(libName)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서관을 찾을 수 없습니다: " + libName));
        library.setHasCrawler(hasCrawler);
        libraryRepository.save(library);
    }

    @Override
    public List<Library> getLibrariesByHasCrawlerStatus(boolean hasCrawler) {
        return libraryRepository.findByHasCrawler(hasCrawler);
    }
}
