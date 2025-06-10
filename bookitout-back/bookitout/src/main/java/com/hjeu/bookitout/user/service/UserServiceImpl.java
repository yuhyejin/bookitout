package com.hjeu.bookitout.user.service;

import com.hjeu.bookitout.provider.JwtProvider;
import com.hjeu.bookitout.user.domain.RefreshToken;
import com.hjeu.bookitout.user.domain.User;
import com.hjeu.bookitout.user.dto.UserDTO;
import com.hjeu.bookitout.user.repository.RefreshTokenRedisRepository;
import com.hjeu.bookitout.user.repository.UserRepository;
import com.hjeu.bookitout.user.vo.response.TokenResponseVO;
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

        String accessToken = jwtProvider.createAccessToken(user.getUserId(), "USER");
        String refreshToken = jwtProvider.createRefreshToken(user.getUserId());

        // Redis에 저장
        refreshTokenRedisRepository.save(RefreshToken.builder()
                .userId(user.getUserId())
                .token(refreshToken)
                .build());

        return new TokenResponseVO(accessToken, refreshToken);
    }

    // RefreshToken을 이용한 재발급
    public TokenResponseVO reissue(String refreshToken) {
        String userId = jwtProvider.validate(refreshToken);
        if (userId == null) throw new IllegalArgumentException("유효하지 않은 토큰");

        RefreshToken saved = refreshTokenRedisRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("리프레시 토큰이 존재하지 않음"));

        if (!saved.getToken().equals(refreshToken)) {
            throw new IllegalArgumentException("토큰 불일치");
        }

        String newAccessToken = jwtProvider.createAccessToken(userId, "USER");
        return new TokenResponseVO(newAccessToken, refreshToken); // refresh는 그대로 유지
    }

    // 로그아웃
    @Override
    public void logout(String userId) {
        refreshTokenRedisRepository.deleteById(userId);
    }
}
