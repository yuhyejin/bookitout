package com.hjeu.bookitout.user.controller;

import com.hjeu.bookitout.user.dto.UserDTO;
import com.hjeu.bookitout.user.service.UserService;
import com.hjeu.bookitout.user.vo.request.SignupRequestVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestVO signupRequestVO) {
        try {
            UserDTO userDTO = UserDTO.builder()
                    .userId(signupRequestVO.getUserId())
                    .password(signupRequestVO.getPassword())
                    .nickname(signupRequestVO.getNickname())
                    .build();
            userService.signup(userDTO);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
