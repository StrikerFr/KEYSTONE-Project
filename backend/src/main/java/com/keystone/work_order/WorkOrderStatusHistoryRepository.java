package com.keystone.work_order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WorkOrderStatusHistoryRepository extends JpaRepository<WorkOrderStatusHistory, UUID> {
    List<WorkOrderStatusHistory> findByWorkOrderIdOrderByCreatedAtDesc(UUID workOrderId);
}