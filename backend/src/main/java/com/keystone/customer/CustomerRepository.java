package com.keystone.customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Page<Customer> findByOrganizationId(UUID orgId, Pageable pageable);
    Optional<Customer> findByIdAndOrganizationId(UUID id, UUID orgId);
    @Query("SELECT c FROM Customer c WHERE c.organization.id = :orgId AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(c.companyName) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<Customer> searchByOrgId(@Param("orgId") UUID orgId, @Param("q") String q, Pageable pageable);
    long countByOrganizationId(UUID orgId);
}