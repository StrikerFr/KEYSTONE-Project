package com.keystone.auth;
import com.keystone.user.UserDto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {
    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password
    ) {}

    public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserDto.Response user
    ) {}

    public record RefreshRequest(@NotBlank String refreshToken) {}
}