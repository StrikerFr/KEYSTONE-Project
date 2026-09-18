package com.keystone.security;
import java.util.UUID;

public record KeystonePrincipal(UUID userId, String role, UUID orgId) {
    public boolean isAdmin() { return "ADMIN".equals(role); }
    public boolean isManager() { return "MANAGER".equals(role) || isAdmin(); }
    public boolean isTechnician() { return "TECHNICIAN".equals(role); }
    public boolean isCustomer() { return "CUSTOMER".equals(role); }
}