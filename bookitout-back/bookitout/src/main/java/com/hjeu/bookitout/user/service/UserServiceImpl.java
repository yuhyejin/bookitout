package com.hjeu.bookitout.user.service;

import com.hjeu.bookitout.provider.JwtProvider;
import com.hjeu.bookitout.user.domain.User;
import com.hjeu.bookitout.user.dto.UserDTO;
import com.hjeu.bookitout.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
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
                .status(true)
                .build();
        userRepository.save(user);
    }

    // 로그인
    @Override
    public String login(UserDTO userDTO) {
        User user = userRepository.findByUserId(userDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        if (!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return jwtProvider.createA(user.getUserId());
    }
}
