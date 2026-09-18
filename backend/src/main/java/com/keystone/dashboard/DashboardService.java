package com.keystone.dashboard;

import com.keystone.activity_log.ActivityLogService;
import com.keystone.customer.CustomerRepository;
import com.keystone.inventory.PartRepository;
import com.keystone.security.KeystonePrincipal;
import com.keystone.service_request.ServiceRequestRepository;
import com.keystone.service_request.ServiceRequestStatus;
import com.keystone.technician.TechnicianRepository;
import com.keystone.work_order.WorkOrder;
import com.keystone.work_order.WorkOrderPriority;
import com.keystone.work_order.WorkOrderRepository;
import com.keystone.work_order.WorkOrderService;
import com.keystone.work_order.WorkOrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WorkOrderRepository workOrderRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final TechnicianRepository technicianRepository;
    private final PartRepository partRepository;
    private final WorkOrderService workOrderService;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public DashboardDto.OverviewData getOverview(KeystonePrincipal principal) {
        UUID orgId = principal.organizationId();
        LocalDateTime now = LocalDateTime.now();

        long totalWO = workOrderRepository.countByOrganizationId(orgId);
        long openWO = workOrderRepository.countByOrganizationIdAndStatusIn(orgId, List.of(WorkOrderStatus.NEW, WorkOrderStatus.ASSIGNED, WorkOrderStatus.SCHEDULED));
        long inProgressWO = workOrderRepository.countByOrganizationIdAndStatus(orgId, WorkOrderStatus.IN_PROGRESS);
        long completedWO = workOrderRepository.countByOrganizationIdAndStatus(orgId, WorkOrderStatus.COMPLETED);
        long pendingSR = serviceRequestRepository.countByOrganizationIdAndStatus(orgId, ServiceRequestStatus.PENDING);

        long slaAtRisk = workOrderRepository.countAtRiskSla(orgId, now, now.plusHours(4));
        long slaBreached = workOrderRepository.countBreachedSla(orgId, now);

        double slaCompliance = (totalWO > 0)
                ? Math.round(((double) (totalWO - slaBreached) / totalWO) * 100.0 * 10.0) / 10.0
                : 100.0;

        long activeTechs = technicianRepository.countByOrganizationId(orgId);
        long lowStock = partRepository.findLowStockParts(orgId).size();

        DashboardDto.Summary summary = DashboardDto.Summary.builder()
                .totalWorkOrders(totalWO)
                .openWorkOrders(openWO)
                .inProgressWorkOrders(inProgressWO)
                .completedWorkOrders(completedWO)
                .pendingServiceRequests(pendingSR)
                .slaAtRisk(slaAtRisk)
                .slaBreached(slaBreached)
                .slaCompliancePercentage(slaCompliance)
                .activeTechnicians(activeTechs)
                .lowStockItems(lowStock)
                .build();

        List<WorkOrderDto.Response> recentWOs = workOrderRepository.findRecent(orgId, PageRequest.of(0, 5))
                .getContent().stream()
                .map(workOrderService::toResponseDto)
                .toList();

        List<ActivityLogService.Dto> recentActivity = activityLogService.getRecentActivity(principal);

        Map<String, Long> statusDist = workOrderRepository.findByOrganizationId(orgId, PageRequest.of(0, 1000))
                .getContent().stream()
                .collect(Collectors.groupingBy(wo -> wo.getStatus().name(), Collectors.counting()));

        Map<String, Long> priorityDist = workOrderRepository.findByOrganizationId(orgId, PageRequest.of(0, 1000))
                .getContent().stream()
                .collect(Collectors.groupingBy(wo -> wo.getPriority().name(), Collectors.counting()));

        return DashboardDto.OverviewData.builder()
                .summary(summary)
                .recentWorkOrders(recentWOs)
                .recentActivity(recentActivity)
                .statusDistribution(statusDist)
                .priorityDistribution(priorityDist)
                .build();
    }
}