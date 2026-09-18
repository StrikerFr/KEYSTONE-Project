package com.keystone.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WorkOrderPartRepository extends JpaRepository<WorkOrderPart, UUID> {
    List<WorkOrderPart> findByWorkOrderId(UUID workOrderId);
}