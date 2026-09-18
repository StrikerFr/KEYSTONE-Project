package com.keystone.asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {
    Page<Asset> findByOrganizationId(UUID orgId, Pageable pageable);
    Optional<Asset> findByIdAndOrganizationId(UUID id, UUID orgId);
    Page<Asset> findByCustomerId(UUID customerId, Pageable pageable);
    long countByOrganizationId(UUID orgId);
}