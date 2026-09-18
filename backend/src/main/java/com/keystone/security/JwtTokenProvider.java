package com.keystone.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
@Slf4j
public class JwtTokenProvider {
    private final SecretKey key;
    private final long accessTokenExpMs;
    private final long refreshTokenExpMs;

    public JwtTokenProvider(
        @Value("${keystone.jwt.secret}") String secret,
        @Value("${keystone.jwt.access-token-expiration-ms}") long accessTokenExpMs,
        @Value("${keystone.jwt.refresh-token-expiration-ms}") long refreshTokenExpMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenExpMs = accessTokenExpMs;
        this.refreshTokenExpMs = refreshTokenExpMs;
    }

    public String generateAccessToken(UUID userId, String role, UUID orgId) {
        Date now = new Date();
        return Jwts.builder()
            .subject(userId.toString())
            .claim("role", role)
            .claim("orgId", orgId.toString())
            .issuedAt(now)
            .expiration(new Date(now.getTime() + accessTokenExpMs))
            .signWith(key)
            .compact();
    }

    public String generateRefreshToken(UUID userId) {
        Date now = new Date();
        return Jwts.builder()
            .subject(userId.toString())
            .claim("type", "refresh")
            .issuedAt(now)
            .expiration(new Date(now.getTime() + refreshTokenExpMs))
            .signWith(key)
            .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public UUID getUserId(String token) {
        return UUID.fromString(parseToken(token).getSubject());
    }

    public String getRole(String token) {
        return parseToken(token).get("role", String.class);
    }

    public UUID getOrgId(String token) {
        return UUID.fromString(parseToken(token).get("orgId", String.class));
    }
}