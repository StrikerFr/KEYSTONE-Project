package com.keystone.notification;

import com.keystone.common.KeystoneException;
import com.keystone.security.KeystonePrincipal;
import com.keystone.user.User;
import com.keystone.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void notifyUser(UUID userId, String title, String message, String entityType, UUID entityId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .entityType(entityType)
                .entityId(entityId)
                .read(false)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(KeystonePrincipal principal) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(principal.userId(), PageRequest.of(0, 50))
                .getContent().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(KeystonePrincipal principal) {
        return notificationRepository.countByUserIdAndReadFalse(principal.userId());
    }

    @Transactional
    public void markAsRead(KeystonePrincipal principal, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.getUser().getId().equals(principal.userId())) {
            throw new KeystoneException(HttpStatus.FORBIDDEN, "Access denied");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(KeystonePrincipal principal) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(principal.userId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .entityType(n.getEntityType())
                .entityId(n.getEntityId())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}