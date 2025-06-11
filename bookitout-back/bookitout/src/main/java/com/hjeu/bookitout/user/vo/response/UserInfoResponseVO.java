package com.hjeu.bookitout.user.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseVO {
    private String userId;
    private String nickname;
    private String role;
} 