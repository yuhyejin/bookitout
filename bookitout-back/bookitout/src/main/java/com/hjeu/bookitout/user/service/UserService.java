package com.hjeu.bookitout.user.service;

import com.hjeu.bookitout.user.dto.UserDTO;
import com.hjeu.bookitout.user.vo.response.TokenResponseVO;
import com.hjeu.bookitout.user.vo.response.UserInfoResponseVO;

public interface UserService {
    void signup(UserDTO userDTO);

    TokenResponseVO login(UserDTO userDTO);

    TokenResponseVO reissue(String refreshToken);

    void logout(String userId);

    void checkId(String userId);

    void checkNickname(String nickname);
    
    UserInfoResponseVO getUserInfo(String userId);
}
