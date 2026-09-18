package com.keystone.notification;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private String entityType;
    private UUID entityId;
    private boolean read;
    private LocalDateTime createdAt;
}