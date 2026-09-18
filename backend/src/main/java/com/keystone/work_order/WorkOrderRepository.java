package com.keystone.work_order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, UUID>, JpaSpecificationExecutor<WorkOrder> {

    Page<WorkOrder> findByOrganizationId(UUID organizationId, Pageable pageable);

    Optional<WorkOrder> findByIdAndOrganizationId(UUID id, UUID organizationId);

    Page<WorkOrder> findByOrganizationIdAndAssignedTechnicianId(UUID organizationId, UUID technicianId, Pageable pageable);

    Page<WorkOrder> findByOrganizationIdAndCustomerId(UUID organizationId, UUID customerId, Pageable pageable);

    Page<WorkOrder> findByOrganizationIdAndStatus(UUID organizationId, WorkOrderStatus status, Pageable pageable);

    long countByOrganizationIdAndStatus(UUID organizationId, WorkOrderStatus status);

    long countByOrganizationId(UUID organizationId);

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.organization.id = :orgId AND w.status IN :statuses")
    long countByOrganizationIdAndStatusIn(@Param("orgId") UUID orgId, @Param("statuses") List<WorkOrderStatus> statuses);

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.organization.id = :orgId AND w.slaDeadline IS NOT NULL AND w.slaDeadline < :now AND w.status NOT IN ('COMPLETED', 'CLOSED', 'CANCELLED')")
    long countBreachedSla(@Param("orgId") UUID orgId, @Param("now") LocalDateTime now);

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.organization.id = :orgId AND w.slaDeadline IS NOT NULL AND w.slaDeadline BETWEEN :now AND :atRiskTime AND w.status NOT IN ('COMPLETED', 'CLOSED', 'CANCELLED')")
    long countAtRiskSla(@Param("orgId") UUID orgId, @Param("now") LocalDateTime now, @Param("atRiskTime") LocalDateTime atRiskTime);

    @Query("SELECT w FROM WorkOrder w WHERE w.organization.id = :orgId AND w.slaDeadline IS NOT NULL AND w.status NOT IN ('COMPLETED', 'CLOSED', 'CANCELLED') ORDER BY w.slaDeadline ASC")
    List<WorkOrder> findActiveSlaTracked(@Param("orgId") UUID orgId);

    @Query("SELECT w FROM WorkOrder w WHERE w.organization.id = :orgId AND w.assignedTechnician.id = :techId AND w.id != :excludeWoId AND w.status NOT IN ('COMPLETED', 'CLOSED', 'CANCELLED') AND w.scheduledStart IS NOT NULL AND w.scheduledEnd IS NOT NULL AND w.scheduledStart < :scheduledEnd AND w.scheduledEnd > :scheduledStart")
    List<WorkOrder> findOverlappingTechnicianWorkOrders(
            @Param("orgId") UUID orgId,
            @Param("techId") UUID techId,
            @Param("excludeWoId") UUID excludeWoId,
            @Param("scheduledStart") LocalDateTime scheduledStart,
            @Param("scheduledEnd") LocalDateTime scheduledEnd
    );

    @Query("SELECT w FROM WorkOrder w WHERE w.organization.id = :orgId ORDER BY w.createdAt DESC")
    Page<WorkOrder> findRecent(@Param("orgId") UUID orgId, Pageable pageable);
}