package com.keystone.technician;
import com.keystone.organization.Organization;
import com.keystone.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity @Table(name = "technicians")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Technician {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column(length = 100)
    private String specialization;
    @Column(length = 30)
    private String phone;
    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false, length = 20)
    private TechnicianStatus availabilityStatus = TechnicianStatus.AVAILABLE;
    @Column(name = "sla_score", precision = 5, scale = 2)
    private BigDecimal slaScore = BigDecimal.ZERO;
    @Column(name = "completed_jobs")
    private int completedJobs = 0;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "technician_skills", joinColumns = @JoinColumn(name = "technician_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();
    @CreationTimestamp private Instant createdAt;
    @UpdateTimestamp private Instant updatedAt;
}