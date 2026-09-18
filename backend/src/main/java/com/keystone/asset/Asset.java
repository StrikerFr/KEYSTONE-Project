package com.keystone.asset;
import com.keystone.customer.Customer;
import com.keystone.organization.Organization;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity @Table(name = "assets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Asset {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    @Column(name = "asset_tag", length = 100)
    private String assetTag;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(length = 100)
    private String type;
    @Column(length = 100)
    private String manufacturer;
    @Column(length = 100)
    private String model;
    @Column(name = "serial_number", length = 100)
    private String serialNumber;
    @Column(length = 200)
    private String location;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssetStatus status = AssetStatus.OPERATIONAL;
    @Column(name = "installation_date")
    private LocalDate installationDate;
    @Column(name = "last_service_date")
    private LocalDate lastServiceDate;
    @Column(name = "next_maintenance_date")
    private LocalDate nextMaintenanceDate;
    @CreationTimestamp private Instant createdAt;
    @UpdateTimestamp private Instant updatedAt;
}