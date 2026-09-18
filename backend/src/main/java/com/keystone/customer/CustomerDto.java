package com.keystone.customer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

public class CustomerDto {
    public record Response(UUID id, UUID organizationId, String name, String email,
        String phone, String companyName, CustomerStatus status,
        int locationCount, int openOrderCount, Instant createdAt, Instant updatedAt) {}
    public record CreateRequest(
        @NotBlank String name, @Email String email, String phone,
        String companyName, UUID organizationId) {}
    public record UpdateRequest(String name, String email, String phone, 
        String companyName, CustomerStatus status) {}
}