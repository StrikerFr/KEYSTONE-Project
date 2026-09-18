package com.keystone.activity_log;

import com.keystone.organization.Organization;
import com.keystone.organization.OrganizationRepository;
import com.keystone.security.KeystonePrincipal;
import com.keystone.user.User;
import com.keystone.user.UserRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void log(KeystonePrincipal principal, String entityType, UUID entityId, String action, String description) {
        Organization org = organizationRepository.findById(principal.organizationId()).orElse(null);
        if (org == null) return;

        User user = principal.userId() != null ? userRepository.findById(principal.userId()).orElse(null) : null;

        ActivityLog log = ActivityLog.builder()
                .organization(org)
                .user(user)
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .description(description)
                .build();

        activityLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<Dto> getRecentActivity(KeystonePrincipal principal) {
        return activityLogRepository.findTop20ByOrganizationIdOrderByCreatedAtDesc(principal.organizationId()).stream()
                .map(this::toDto)
                .toList();
    }

    private Dto toDto(ActivityLog a) {
        return Dto.builder()
                .id(a.getId())
                .userName(a.getUser() != null ? a.getUser().getFirstName() + " " + a.getUser().getLastName() : "System")
                .userRole(a.getUser() != null ? a.getUser().getRole().name() : "SYSTEM")
                .entityType(a.getEntityType())
                .entityId(a.getEntityId())
                .action(a.getAction())
                .description(a.getDescription())
                .createdAt(a.getCreatedAt())
                .build();
    }

    @Getter
    @Setter
    @Builder
    public static class Dto {
        private UUID id;
        private String userName;
        private String userRole;
        private String entityType;
        private UUID entityId;
        private String action;
        private String description;
        private LocalDateTime createdAt;
    }
}