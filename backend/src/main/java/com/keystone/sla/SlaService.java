package com.keystone.sla;
import com.keystone.work_order.WorkOrderPriority;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class SlaService {
    private final SlaPolicyRepository slaPolicyRepository;

    @Value("${keystone.sla.at-risk-threshold-percent:20}")
    private int atRiskThresholdPercent;

    public Instant calculateDeadline(UUID orgId, WorkOrderPriority priority, Instant startTime) {
        Optional<SlaPolicy> policy = slaPolicyRepository.findByOrganizationIdAndPriorityAndActiveTrue(orgId, priority);
        if (policy.isEmpty()) {
            // Default fallback: 24 hours
            return startTime.plusSeconds(24 * 3600);
        }
        return startTime.plusSeconds((long) policy.get().getResolutionTimeMinutes() * 60);
    }

    public SlaStatus computeStatus(Instant deadline, Instant createdAt) {
        if (deadline == null) return SlaStatus.HEALTHY;
        Instant now = Instant.now();
        if (now.isAfter(deadline)) return SlaStatus.BREACHED;
        long totalMs = deadline.toEpochMilli() - createdAt.toEpochMilli();
        long remainingMs = deadline.toEpochMilli() - now.toEpochMilli();
        if (totalMs <= 0) return SlaStatus.BREACHED;
        double remainingPercent = (double) remainingMs / totalMs * 100;
        return remainingPercent <= atRiskThresholdPercent ? SlaStatus.AT_RISK : SlaStatus.HEALTHY;
    }

    public long getRemainingMinutes(Instant deadline) {
        if (deadline == null) return Long.MAX_VALUE;
        long diff = deadline.toEpochMilli() - Instant.now().toEpochMilli();
        return diff / 60000;
    }
}