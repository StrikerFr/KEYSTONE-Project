package com.keystone.technician;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TechnicianRepository extends JpaRepository<Technician, UUID> {
    Page<Technician> findByOrganizationId(UUID orgId, Pageable pageable);
    List<Technician> findByOrganizationIdAndAvailabilityStatus(UUID orgId, TechnicianStatus status);
    Optional<Technician> findByIdAndOrganizationId(UUID id, UUID orgId);
    Optional<Technician> findByUserId(UUID userId);
    long countByOrganizationIdAndAvailabilityStatus(UUID orgId, TechnicianStatus status);
}