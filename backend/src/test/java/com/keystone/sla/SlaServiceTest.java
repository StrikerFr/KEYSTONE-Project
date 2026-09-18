package com.keystone.sla;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SlaServiceTest {

    private SlaService slaService;

    @BeforeEach
    void setUp() {
        slaService = new SlaService();
    }

    @Test
    @DisplayName("Calculate deadline adds resolution time minutes correctly")
    void testCalculateDeadline() {
        SlaPolicy policy = SlaPolicy.builder()
                .resolutionTimeMinutes(120)
                .build();

        LocalDateTime start = LocalDateTime.of(2026, 9, 18, 10, 0);
        LocalDateTime deadline = slaService.calculateDeadline(policy, start);

        assertEquals(LocalDateTime.of(2026, 9, 18, 12, 0), deadline);
    }

    @Test
    @DisplayName("Deadline in past returns BREACHED")
    void testComputeStatusBreached() {
        LocalDateTime deadline = LocalDateTime.now().minusMinutes(10);
        LocalDateTime created = LocalDateTime.now().minusHours(2);

        SlaStatus status = slaService.computeStatus(deadline, created);
        assertEquals(SlaStatus.BREACHED, status);
    }

    @Test
    @DisplayName("Deadline near expiry returns AT_RISK")
    void testComputeStatusAtRisk() {
        LocalDateTime created = LocalDateTime.now().minusMinutes(90);
        LocalDateTime deadline = LocalDateTime.now().plusMinutes(10); // 10 mins remaining out of 100 total

        SlaStatus status = slaService.computeStatus(deadline, created);
        assertEquals(SlaStatus.AT_RISK, status);
    }

    @Test
    @DisplayName("Deadline far in future returns HEALTHY")
    void testComputeStatusHealthy() {
        LocalDateTime created = LocalDateTime.now().minusMinutes(10);
        LocalDateTime deadline = LocalDateTime.now().plusHours(24);

        SlaStatus status = slaService.computeStatus(deadline, created);
        assertEquals(SlaStatus.HEALTHY, status);
    }
}