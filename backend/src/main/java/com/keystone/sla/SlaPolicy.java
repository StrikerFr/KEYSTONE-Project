package com.keystone.sla;
import com.keystone.organization.Organization;
import com.keystone.work_order.WorkOrderPriority;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "sla_policies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SlaPolicy {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column(nullable = false, length = 100)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkOrderPriority priority;
    @Column(name = "response_time_minutes", nullable = false)
    private int responseTimeMinutes;
    @Column(name = "resolution_time_minutes", nullable = false)
    private int resolutionTimeMinutes;
    @Column(nullable = false)
    private boolean active = true;
    @CreationTimestamp private Instant createdAt;
}