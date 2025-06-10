package com.hjeu.bookitout.user.repository;

import com.hjeu.bookitout.user.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, String> {
}
