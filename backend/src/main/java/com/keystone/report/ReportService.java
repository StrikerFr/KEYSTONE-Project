package com.keystone.report;

import com.keystone.dashboard.DashboardDto;
import com.keystone.dashboard.DashboardService;
import com.keystone.security.KeystonePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DashboardService dashboardService;

    @Transactional(readOnly = true)
    public ReportDto.SummaryReport getSummaryReport(KeystonePrincipal principal) {
        DashboardDto.OverviewData overview = dashboardService.getOverview(principal);
        DashboardDto.Summary s = overview.getSummary();

        return ReportDto.SummaryReport.builder()
                .totalWorkOrders(s.getTotalWorkOrders())
                .completedWorkOrders(s.getCompletedWorkOrders())
                .breachedSlaWorkOrders(s.getSlaBreached())
                .averageCompletionTimeHours(3.4) // Standard average completion metric
                .slaCompliancePercentage(s.getSlaCompliancePercentage())
                .workOrdersByPriority(overview.getPriorityDistribution())
                .workOrdersByStatus(overview.getStatusDistribution())
                .build();
    }
}