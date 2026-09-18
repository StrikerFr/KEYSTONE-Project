package com.keystone.service_request;

import com.keystone.customer.CustomerDto;
import com.keystone.work_order.WorkOrderPriority;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class ServiceRequestDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private String requestNumber;
        private CustomerDto customer;
        private String title;
        private String description;
        private ServiceRequestStatus status;
        private WorkOrderPriority priority;
        private String locationAddress;
        private UUID convertedWorkOrderId;
        private String convertedWorkOrderNumber;
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
        @NotBlank(message = "Description is required")
        private String description;
        private WorkOrderPriority priority;
        private UUID customerId;
        private String locationAddress;
    }
}