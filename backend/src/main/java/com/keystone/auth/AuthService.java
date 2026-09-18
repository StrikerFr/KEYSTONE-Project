package com.keystone.auth;
import com.keystone.common.KeystoneException;
import com.keystone.security.JwtTokenProvider;
import com.keystone.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public AuthDto.LoginResponse login(AuthDto.LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw KeystoneException.badRequest("ACCOUNT_INACTIVE", "Your account is inactive.");
        }
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getId().toString(), req.password())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(
            user.getId(), user.getRole().name(), user.getOrganization().getId());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthDto.LoginResponse(
            accessToken, refreshToken, "Bearer", 900,
            userService.toDto(user)
        );
    }

    public UserDto.Response getCurrentUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> KeystoneException.notFound("User", userId));
        return userService.toDto(user);
    }
}