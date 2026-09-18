package com.keystone.notification;

import com.keystone.common.ApiResponse;
import com.keystone.security.KeystonePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(
            @AuthenticationPrincipal KeystonePrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUserNotifications(principal)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal KeystonePrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", notificationService.getUnreadCount(principal))));
    }

    @PATCH("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id
    ) {
        notificationService.markAsRead(principal, id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PATCH("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal KeystonePrincipal principal
    ) {
        notificationService.markAllAsRead(principal);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}