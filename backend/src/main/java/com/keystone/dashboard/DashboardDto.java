package com.keystone.dashboard;

import com.keystone.activity_log.ActivityLogService;
import com.keystone.work_order.WorkOrderDto;
import lombok.*;

import java.util.List;
import java.util.Map;

public class DashboardDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private long totalWorkOrders;
        private long openWorkOrders;
        private long inProgressWorkOrders;
        private long completedWorkOrders;
        private long pendingServiceRequests;
        private long slaAtRisk;
        private long slaBreached;
        private double slaCompliancePercentage;
        private long activeTechnicians;
        private long lowStockItems;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OverviewData {
        private Summary summary;
        private List<WorkOrderDto.Response> recentWorkOrders;
        private List<ActivityLogService.Dto> recentActivity;
        private Map<String, Long> statusDistribution;
        private Map<String, Long> priorityDistribution;
    }
}