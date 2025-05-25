package com.hjeu.bookitout.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserDTO {
    private String userId;
    private String password;
    private String nickname;
    private boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
}
