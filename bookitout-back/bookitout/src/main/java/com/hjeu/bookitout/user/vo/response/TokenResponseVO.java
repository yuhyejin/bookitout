package com.hjeu.bookitout.user.vo.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponseVO {
    private String accessToken;
    private String refreshToken;
    private String role;
}
