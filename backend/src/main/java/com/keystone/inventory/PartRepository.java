package com.keystone.inventory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PartRepository extends JpaRepository<Part, UUID> {
    Page<Part> findByOrganizationId(UUID organizationId, Pageable pageable);
    Optional<Part> findByIdAndOrganizationId(UUID id, UUID organizationId);

    @Query("SELECT p FROM Part p WHERE p.organization.id = :orgId AND p.quantityOnHand <= p.reorderLevel")
    List<Part> findLowStockParts(@Param("orgId") UUID orgId);

    long countByOrganizationId(UUID organizationId);
}