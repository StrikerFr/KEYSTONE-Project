package com.keystone.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class InventoryDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PartResponse {
        private UUID id;
        private String partNumber;
        private String name;
        private String description;
        private String category;
        private BigDecimal unitPrice;
        private Integer quantityOnHand;
        private Integer reorderLevel;
        private boolean lowStock;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreatePartRequest {
        @NotBlank(message = "Part number is required")
        private String partNumber;
        @NotBlank(message = "Name is required")
        private String name;
        private String description;
        private String category;
        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;
        @NotNull(message = "Quantity on hand is required")
        @Min(0)
        private Integer quantityOnHand;
        @NotNull(message = "Reorder level is required")
        @Min(0)
        private Integer reorderLevel;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddPartToWorkOrderRequest {
        @NotNull(message = "Part ID is required")
        private UUID partId;
        @NotNull(message = "Quantity is required")
        @Min(1)
        private Integer quantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkOrderPartResponse {
        private UUID id;
        private UUID workOrderId;
        private UUID partId;
        private String partNumber;
        private String partName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
}