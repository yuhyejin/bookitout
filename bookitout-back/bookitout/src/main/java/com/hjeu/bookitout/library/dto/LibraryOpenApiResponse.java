package com.hjeu.bookitout.library.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;

import java.util.List;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class LibraryOpenApiResponse {

    private Response response;

    public List<LibraryRaw> getLibs() {
        if (response == null || response.libs == null) return List.of();
        return response.libs.stream()
                .map(LibWrapper::getLib)
                .toList();
    }

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {
        private List<LibWrapper> libs;
    }

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LibWrapper {
        private LibraryRaw lib;
    }

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LibraryRaw {
        private String libCode;
        private String libName;
        private String homepage;
        private String address;
    }
}
