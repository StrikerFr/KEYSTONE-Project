# Security Policy

## Reporting Vulnerabilities
If you discover a security vulnerability within KEYSTONE, please do NOT open a public issue.

Instead, please send a security report to security@keystone-fsm.local.

## Security Practices
- Stateless JWT authentication with HMAC-SHA512.
- BCrypt password hashing.
- Strict organization-level multitenancy data isolation.
- Role-based authorization policies (`ADMIN`, `MANAGER`, `TECHNICIAN`, `CUSTOMER`).
