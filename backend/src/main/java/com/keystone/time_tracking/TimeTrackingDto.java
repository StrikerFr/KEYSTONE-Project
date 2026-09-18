package com.keystone.time_tracking;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class TimeTrackingDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private UUID workOrderId;
        private String workOrderNumber;
        private UUID technicianId;
        private String technicianName;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Long durationMinutes;
        private String description;
        private boolean active;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StartRequest {
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StopRequest {
        private String description;
    }
}