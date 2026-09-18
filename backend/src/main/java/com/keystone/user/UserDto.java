package com.keystone.user;
import java.time.Instant;
import java.util.UUID;

public class UserDto {
    public record Response(UUID id, UUID organizationId, String organizationName,
        String name, String email, UserRole role, UserStatus status,
        String avatarUrl, Instant lastLoginAt, Instant createdAt) {}
    public record CreateRequest(String name, String email, String password,
        UserRole role, UUID organizationId) {}
    public record UpdateRequest(String name, String avatarUrl, UserStatus status) {}
}