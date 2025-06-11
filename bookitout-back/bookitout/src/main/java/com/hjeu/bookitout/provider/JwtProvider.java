package com.hjeu.bookitout.provider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKeyString;

    private Key secretKey;

    @PostConstruct
    public void init() {
        // 32자 이상
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    // 토큰 생성
    public String createAccessToken(String userId, String role) {
        Date expiry = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(expiry)
                .claim("userId", userId)
                .claim("role", role)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 리프레시 토큰 발급
    public String createRefreshToken(String userId) {
        Date expiry = Date.from(Instant.now().plus(14, ChronoUnit.DAYS)); // 2주

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(expiry)
                .claim("userId", userId)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 검증 (유효성만 검사)
    public boolean validate(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 클레임에서 userId 직접 꺼내기
    public String extractUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userId", String.class);
    }

    // 클레임에서 role 직접 꺼내기
    public String extractRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }
}
