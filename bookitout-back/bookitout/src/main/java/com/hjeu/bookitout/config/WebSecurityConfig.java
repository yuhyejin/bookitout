package com.hjeu.bookitout.config;

import com.hjeu.bookitout.filter.JwtAuthenticationFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;

@Configurable
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .httpBasic(httpBasic -> httpBasic.disable()) // HTTP Basic 비활성화
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 무상태 세션
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/v1/auth/**", "/api/v1/search/**", "/api/v1/book/**").permitAll() // 특정 URL 허용
                        .requestMatchers(HttpMethod.GET, "/api/v1/search/**", "/api/v1/user/*", "/api/v1/library/libraryList").permitAll() // 특정 URL 허용
                        .anyRequest().authenticated() // 나머지 요청 인증 필요
                )
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(new FailedAuthenticationEntryPoint()) // 인증 실패 처리기 설정
                );
        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // JWT 필터 추가

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // 모든 Origin 허용
        configuration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용
        configuration.addAllowedHeader("*"); // 모든 헤더 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


}

class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"code\": \"AF\", \"message\": \"Authorization Failed\" }");
    }
}
