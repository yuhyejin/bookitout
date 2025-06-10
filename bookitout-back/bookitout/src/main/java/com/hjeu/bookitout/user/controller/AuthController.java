package com.hjeu.bookitout.user.controller;

import com.hjeu.bookitout.user.dto.UserDTO;
import com.hjeu.bookitout.user.service.UserService;
import com.hjeu.bookitout.user.vo.request.LoginRequestVO;
import com.hjeu.bookitout.user.vo.request.SignupRequestVO;
import com.hjeu.bookitout.user.vo.response.TokenResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


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

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestVO loginRequestVO) {
        try {
            UserDTO userDTO = UserDTO.builder()
                    .userId(loginRequestVO.getUserId())
                    .password(loginRequestVO.getPassword())
                    .build();
            TokenResponseVO tokens = userService.login(userDTO);
            return ResponseEntity.ok(tokens);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // RefreshToken을 이용한 재발급
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(@RequestHeader("Refresh-Token") String refreshToken) {
        try {
            TokenResponseVO newTokens = userService.reissue(refreshToken);
            return ResponseEntity.ok(newTokens);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal String userId) {
        try {
            userService.logout(userId);
            return ResponseEntity.ok("로그아웃 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그아웃 실패");
        }
    }

    // 아이디 중복확인
    @GetMapping("/check-id")
    public ResponseEntity<?> checkId(@RequestParam String userId) {
        try {
            userService.checkId(userId);
            return ResponseEntity.ok("사용할 수 있는 아이디입니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("아이디 중복 확인 중 오류가 발생했습니다.");
        }
    }
}
