package com.keystone.customer;
import com.keystone.organization.Organization;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "customers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Customer {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(length = 200)
    private String email;
    @Column(length = 30)
    private String phone;
    @Column(name = "company_name", length = 200)
    private String companyName;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerStatus status = CustomerStatus.ACTIVE;
    @CreationTimestamp private Instant createdAt;
    @UpdateTimestamp private Instant updatedAt;
}