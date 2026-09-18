package com.keystone.technician;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class TechnicianDto {
    public record Response(UUID id, UUID userId, String name, String email,
        String specialization, String phone, TechnicianStatus availabilityStatus,
        BigDecimal slaScore, int completedJobs, int activeJobs,
        List<String> skills, Instant createdAt) {}
    public record CreateRequest(UUID userId, String specialization, String phone, List<String> skills) {}
    public record UpdateRequest(String specialization, String phone, TechnicianStatus availabilityStatus, List<String> skills) {}
}