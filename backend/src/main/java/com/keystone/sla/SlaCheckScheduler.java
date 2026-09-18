package com.keystone.sla;

import com.keystone.notification.NotificationService;
import com.keystone.work_order.WorkOrder;
import com.keystone.work_order.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlaCheckScheduler {

    private final WorkOrderRepository workOrderRepository;
    private final SlaService slaService;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 60000) // Check every 60 seconds
    @Transactional
    public void checkSlaDeadlines() {
        log.debug("Running SLA deadline check job...");

        // Fetch work orders across organizations that have SLA tracked and are not completed
        List<WorkOrder> activeOrders = workOrderRepository.findAll().stream()
                .filter(w -> w.getSlaDeadline() != null)
                .filter(w -> w.getStatus() != com.keystone.work_order.WorkOrderStatus.COMPLETED &&
                             w.getStatus() != com.keystone.work_order.WorkOrderStatus.CLOSED &&
                             w.getStatus() != com.keystone.work_order.WorkOrderStatus.CANCELLED)
                .toList();

        for (WorkOrder wo : activeOrders) {
            SlaStatus status = slaService.computeStatus(wo.getSlaDeadline(), wo.getCreatedAt());
            if (status == SlaStatus.BREACHED && wo.getAssignedTechnician() != null && wo.getAssignedTechnician().getUser() != null) {
                notificationService.notifyUser(
                        wo.getAssignedTechnician().getUser().getId(),
                        "SLA Breached!",
                        "Work Order " + wo.getWorkOrderNumber() + " has breached its SLA deadline!",
                        "WORK_ORDER",
                        wo.getId()
                );
            }
        }
    }
}