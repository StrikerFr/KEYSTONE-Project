package com.keystone.work_order;

import com.keystone.asset.AssetDto;
import com.keystone.customer.CustomerDto;
import com.keystone.sla.SlaPolicyDto;
import com.keystone.sla.SlaStatus;
import com.keystone.technician.TechnicianDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class WorkOrderDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private String workOrderNumber;
        private UUID organizationId;
        private String title;
        private String description;
        private WorkOrderStatus status;
        private WorkOrderPriority priority;
        private CustomerDto customer;
        private TechnicianDto assignedTechnician;
        private AssetDto asset;
        private SlaPolicyDto slaPolicy;
        private LocalDateTime slaDeadline;
        private SlaStatus slaStatus;
        private Long remainingSlaMinutes;
        private LocalDateTime scheduledStart;
        private LocalDateTime scheduledEnd;
        private LocalDateTime actualStart;
        private LocalDateTime actualEnd;
        private LocalDateTime completedAt;
        private String locationAddress;
        private Double locationLatitude;
        private Double locationLongitude;
        private String resolutionNotes;
        private String customerSignature;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        @NotNull(message = "Priority is required")
        private WorkOrderPriority priority;
        @NotNull(message = "Customer ID is required")
        private UUID customerId;
        private UUID assignedTechnicianId;
        private UUID assetId;
        private UUID slaPolicyId;
        private LocalDateTime scheduledStart;
        private LocalDateTime scheduledEnd;
        private String locationAddress;
        private Double locationLatitude;
        private Double locationLongitude;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String title;
        private String description;
        private WorkOrderPriority priority;
        private UUID customerId;
        private UUID assignedTechnicianId;
        private UUID assetId;
        private UUID slaPolicyId;
        private LocalDateTime scheduledStart;
        private LocalDateTime scheduledEnd;
        private String locationAddress;
        private Double locationLatitude;
        private Double locationLongitude;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssignRequest {
        @NotNull(message = "Technician ID is required")
        private UUID technicianId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ScheduleRequest {
        @NotNull(message = "Scheduled start is required")
        private LocalDateTime scheduledStart;
        @NotNull(message = "Scheduled end is required")
        private LocalDateTime scheduledEnd;
        private UUID technicianId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatusChangeRequest {
        @NotNull(message = "Target status is required")
        private WorkOrderStatus status;
        private String notes;
        private String resolutionNotes;
        private String customerSignature;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HistoryResponse {
        private UUID id;
        private UUID workOrderId;
        private WorkOrderStatus fromStatus;
        private WorkOrderStatus toStatus;
        private String changedByName;
        private String notes;
        private LocalDateTime createdAt;
    }
}