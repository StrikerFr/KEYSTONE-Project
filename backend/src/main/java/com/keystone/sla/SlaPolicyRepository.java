package com.keystone.sla;
import com.keystone.work_order.WorkOrderPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SlaPolicyRepository extends JpaRepository<SlaPolicy, UUID> {
    Optional<SlaPolicy> findByOrganizationIdAndPriorityAndActiveTrue(UUID orgId, WorkOrderPriority priority);
    List<SlaPolicy> findByOrganizationId(UUID orgId);
}