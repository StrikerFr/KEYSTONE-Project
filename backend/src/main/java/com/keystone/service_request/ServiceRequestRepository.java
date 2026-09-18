package com.keystone.service_request;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, UUID> {
    Page<ServiceRequest> findByOrganizationId(UUID organizationId, Pageable pageable);
    Optional<ServiceRequest> findByIdAndOrganizationId(UUID id, UUID organizationId);
    Page<ServiceRequest> findByOrganizationIdAndCustomerId(UUID organizationId, UUID customerId, Pageable pageable);
    long countByOrganizationIdAndStatus(UUID organizationId, ServiceRequestStatus status);
}