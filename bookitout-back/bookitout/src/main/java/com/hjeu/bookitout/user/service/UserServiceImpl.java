package com.hjeu.bookitout.user.service;

import com.hjeu.bookitout.provider.JwtProvider;
import com.hjeu.bookitout.user.domain.RefreshToken;
import com.hjeu.bookitout.user.domain.User;
import com.hjeu.bookitout.user.dto.UserDTO;
import com.hjeu.bookitout.user.repository.RefreshTokenRedisRepository;
import com.hjeu.bookitout.user.repository.UserRepository;
import com.hjeu.bookitout.user.vo.response.TokenResponseVO;
import com.hjeu.bookitout.user.vo.response.UserInfoResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RefreshTokenRedisRepository refreshTokenRedisRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.refreshTokenRedisRepository = refreshTokenRedisRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    // 회원가입
    @Override
    public void signup(UserDTO userDTO) {
        User user = User.builder()
                .userId(userDTO.getUserId())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .nickname(userDTO.getNickname())
                .createdAt(LocalDateTime.now())
                .status(true)
                .build();
        userRepository.save(user);
    }

    // 로그인
    @Override
    public TokenResponseVO login(UserDTO userDTO) {
        User user = userRepository.findByUserId(userDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        if (!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtProvider.createAccessToken(user.getUserId(), user.getRole().getKey());
        String refreshToken = jwtProvider.createRefreshToken(user.getUserId());

        // Redis에 저장
        refreshTokenRedisRepository.save(RefreshToken.builder()
                .userId(user.getUserId())
                .token(refreshToken)
                .build());

        return new TokenResponseVO(accessToken, refreshToken, user.getRole().getKey());
    }

    // RefreshToken을 이용한 재발급
    public TokenResponseVO reissue(String refreshToken) {
        // 토큰 유효성 검증
        if (!jwtProvider.validate(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 토큰");
        }

        // 유효한 토큰에서 userId 추출
        String userId = jwtProvider.extractUserId(refreshToken);

        RefreshToken saved = refreshTokenRedisRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("리프레시 토큰이 존재하지 않음"));

        if (!saved.getToken().equals(refreshToken)) {
            throw new IllegalArgumentException("토큰 불일치");
        }

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String newAccessToken = jwtProvider.createAccessToken(userId, user.getRole().getKey());
        return new TokenResponseVO(newAccessToken, refreshToken, user.getRole().getKey()); // refresh는 그대로 유지
    }

    // 로그아웃
    @Override
    public void logout(String userId) {
        refreshTokenRedisRepository.deleteById(userId);
    }

    // 아이디 중복확인
    @Override
    public void checkId(String userId) {
        userRepository.findByUserId(userId).ifPresent(user -> {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        });
    }

    // 닉네임 중복확인
    @Override
    public void checkNickname(String nickname) {
        userRepository.findByNickname(nickname).ifPresent(user -> {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        });
    }

    // 사용자 정보 조회
    @Override
    public UserInfoResponseVO getUserInfo(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        return UserInfoResponseVO.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .role(user.getRole().getKey())
                .build();
    }
}
