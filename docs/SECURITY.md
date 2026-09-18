# KEYSTONE Security Model & Policy

## 1. Authentication & JWT Tokens
- **Algorithm**: HMAC-SHA512 with a minimum 256-bit secret key.
- **Access Tokens**: Short-lived (15-minute expiration). Transmitted via HTTP `Authorization: Bearer <token>` header.
- **Refresh Tokens**: Long-lived (7-day expiration).
- **Password Storage**: Encrypted using Spring Security `BCryptPasswordEncoder` with strength factor 10. Password plaintext is never stored or logged.

---

## 2. Role-Based Access Control (RBAC)

| Role | Access Permissions |
| :--- | :--- |
| `ROLE_ADMIN` | Full system access across all domain objects and organization settings. |
| `ROLE_MANAGER` | Work order creation, dispatch, scheduling, technician assignment, reporting. |
| `ROLE_TECHNICIAN` | Access restricted to assigned work orders, timer logging, and inventory usage. |
| `ROLE_CUSTOMER` | Access restricted to owned assets, service requests, and service history. |

---

## 3. Multi-Tenancy Isolation
- Tenant isolation is strictly enforced at the database repository layer (`organization_id = :orgId`).
- Organization claims are extracted directly from authenticated JWT tokens. Client parameters attempting to spoof another organization ID are discarded.

---

## 4. Production Security Guidelines
- **Secrets Management**: JWT secrets and database credentials must be provided via environment variables (`JWT_SECRET`, `POSTGRES_PASSWORD`).
- **Pre-seeded Accounts**: Accounts specified in `V17__seed_data.sql` are strictly for **DEVELOPMENT AND DEMO PURPOSES ONLY**. They must be disabled or replaced prior to production deployment.
