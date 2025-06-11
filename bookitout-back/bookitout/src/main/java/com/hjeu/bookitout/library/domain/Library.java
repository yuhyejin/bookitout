package com.hjeu.bookitout.library.domain;

import com.hjeu.bookitout.library.dto.LibraryOpenApiResponse;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_library")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Library {

    @Id
    @Column(name = "lib_code", nullable = false)
    private String libCode;

    @Column(name = "lib_name")
    private String libName;

    @Column(name = "address")
    private String address;

    @Column(name = "homepage_url")
    private String homepageUrl;

    @Column(name = "has_crawler", nullable = false)
    @Builder.Default
    private boolean hasCrawler = false;

    public static Library fromOpenApi(LibraryOpenApiResponse.LibraryRaw raw) {
        return Library.builder()
                .libCode(raw.getLibCode())
                .libName(raw.getLibName())
                .homepageUrl(raw.getHomepage())
                .address(raw.getAddress())
                .hasCrawler(false)
                .build();
    }

    public void updateFrom(Library other) {
        this.libName = other.getLibName();
        this.homepageUrl = other.getHomepageUrl();
        this.address = other.getAddress();
    }

    public void setHasCrawler(boolean hasCrawler) {
        this.hasCrawler = hasCrawler;
    }
}
