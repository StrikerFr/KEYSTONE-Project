package com.keystone.user;
import com.keystone.common.KeystoneException;
import com.keystone.organization.Organization;
import com.keystone.organization.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User getById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> KeystoneException.notFound("User", id));
    }

    @Transactional
    public User create(UserDto.CreateRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw KeystoneException.conflict("EMAIL_ALREADY_EXISTS", "Email already registered.");
        }
        Organization org = organizationRepository.findById(req.organizationId())
            .orElseThrow(() -> KeystoneException.notFound("Organization", req.organizationId()));
        User user = User.builder()
            .organization(org).name(req.name()).email(req.email())
            .passwordHash(passwordEncoder.encode(req.password()))
            .role(req.role()).status(UserStatus.ACTIVE).build();
        return userRepository.save(user);
    }

    public UserDto.Response toDto(User u) {
        return new UserDto.Response(u.getId(), u.getOrganization().getId(),
            u.getOrganization().getName(), u.getName(), u.getEmail(),
            u.getRole(), u.getStatus(), u.getAvatarUrl(), u.getLastLoginAt(), u.getCreatedAt());
    }
}