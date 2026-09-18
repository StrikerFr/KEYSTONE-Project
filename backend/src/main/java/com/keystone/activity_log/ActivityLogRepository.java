package com.keystone.activity_log;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    Page<ActivityLog> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId, Pageable pageable);
    List<ActivityLog> findTop20ByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
}