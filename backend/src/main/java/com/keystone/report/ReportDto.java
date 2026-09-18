package com.keystone.report;

import lombok.*;

import java.util.Map;

public class ReportDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SummaryReport {
        private long totalWorkOrders;
        private long completedWorkOrders;
        private long breachedSlaWorkOrders;
        private double averageCompletionTimeHours;
        private double slaCompliancePercentage;
        private Map<String, Long> workOrdersByPriority;
        private Map<String, Long> workOrdersByStatus;
    }
}