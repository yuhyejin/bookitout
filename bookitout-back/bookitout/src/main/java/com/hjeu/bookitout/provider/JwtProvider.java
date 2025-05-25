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
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(expiry)
                .addClaims(Map.of("role", role))
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
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 검증 및 userId 추출
    public String validate(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 토큰에서 role 같은 클레임 꺼내기
    public Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
