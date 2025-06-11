package com.hjeu.bookitout.library_favorite.service;

import com.hjeu.bookitout.library.domain.Library;
import com.hjeu.bookitout.library.repository.LibraryRepository;
import com.hjeu.bookitout.library_favorite.domain.LibraryFavorite;
import com.hjeu.bookitout.library_favorite.dto.LibraryFavoriteDTO;
import com.hjeu.bookitout.library_favorite.repository.LibraryFavoriteRepository;
import com.hjeu.bookitout.library_favorite.vo.response.LibraryFavoriteResponseVO;
import com.hjeu.bookitout.library_favorite.dto.HasCrawlerResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class LibraryFavoriteServiceImpl implements LibraryFavoriteService {

    private final LibraryFavoriteRepository libraryFavoriteRepository;
    private final EmailService emailService;
    private final LibraryRepository libraryRepository;
    private final WebClient webClient;

    @Value("${crawler.api.url}")
    private String crawlerApiUrl;

    @Autowired
    public LibraryFavoriteServiceImpl(LibraryFavoriteRepository libraryFavoriteRepository,
                                      EmailService emailService,
                                      LibraryRepository libraryRepository,
                                      @Qualifier("libraryCrawlerApiWebClient") WebClient webClient) {
        this.libraryFavoriteRepository = libraryFavoriteRepository;
        this.emailService = emailService;
        this.libraryRepository = libraryRepository;
        this.webClient = webClient;
    }

    @Override
    @Transactional
    public boolean addFavoriteLibrary(LibraryFavoriteDTO dto) {
        if (libraryFavoriteRepository.existsByUserIdAndLibName(dto.getUserId(), dto.getLibName())) {
            log.info("사용자 {}가 도서관 {}을 이미 즐겨찾기했습니다.", dto.getUserId(), dto.getLibName());
            return true;
        }

        Optional<Library> optionalLibrary = libraryRepository.findByLibName(dto.getLibName());
        boolean hasCrawler = false;

        if (optionalLibrary.isPresent()) {
            Library library = optionalLibrary.get();
            hasCrawler = library.isHasCrawler();

            if (!hasCrawler) {
                try {
                    String url = crawlerApiUrl + "/has_crawler?library=" + dto.getLibName();
                    HasCrawlerResponse response = webClient.get()
                            .uri(url)
                            .retrieve()
                            .bodyToMono(HasCrawlerResponse.class)
                            .block();

                    if (response != null && response.isHas_crawler()) {
                        library.setHasCrawler(true);
                        libraryRepository.save(library);
                        hasCrawler = true;
                        log.info("도서관 {}에 대한 크롤러가 존재함이 확인되어 DB 상태 업데이트.", dto.getLibName());
                    } else {
                        log.info("도서관 {}에 대한 크롤러가 존재하지 않음.", dto.getLibName());
                    }
                } catch (Exception e) {
                    log.error("Flask 크롤러 API 호출 중 오류 발생: {}", e.getMessage());
                }
            }
        } else {
            log.warn("즐겨찾기하려는 도서관 {}이 Library 테이블에 없습니다. 기본적으로 크롤러가 없다고 가정합니다.", dto.getLibName());
        }

        if (!hasCrawler) {
            String subject = "[도서관 등록 요청 알림]";
            String content = String.format("사용자 [%s]가 크롤링 코드가 없는 도서관 [%s (%s)]을 즐겨찾기 등록했습니다. 크롤링 코드 추가가 필요합니다.",
                    dto.getUserId(), dto.getLibName(), dto.getLibUrl());
            emailService.sendToAdmin(subject, content);
            log.info("관리자에게 도서관 {}에 대한 크롤러 요청 이메일 전송 완료.", dto.getLibName());
        }

        LibraryFavorite favorite = LibraryFavorite.builder()
                .userId(dto.getUserId())
                .libName(dto.getLibName())
                .libUrl(dto.getLibUrl())
                .status(true)
                .build();
        libraryFavoriteRepository.save(favorite);

        return true;
    }

    @Override
    public List<LibraryFavoriteResponseVO> getLibraryFavorite(String userId) {
        List<LibraryFavorite> list = libraryFavoriteRepository.findByUserIdAndStatusTrue(userId);
        return list.stream()
                .map(f -> new LibraryFavoriteResponseVO(f.getLibId(), f.getLibName(), f.getLibUrl()))
                .toList();
    }

    @Override
    public void deleteFavorite(Long libId, String userId) {
        LibraryFavorite favorite = libraryFavoriteRepository.findByLibIdAndUserId(libId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 즐겨찾기를 찾을 수 없습니다."));
        favorite.deactivate();
        libraryFavoriteRepository.save(favorite);
    }

    @Override
    public List<String> getFavoriteLibraryNames(String userId) {
        log.info("userId: {}", userId);
        return libraryFavoriteRepository.findLibNamesByUserId(userId);
    }
}
