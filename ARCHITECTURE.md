# KEYSTONE System Architecture & Technical Specifications

## 1. Architectural Overview

KEYSTONE is designed using a multi-tenant, decoupled full-stack architecture:

```
+-----------------------------------------------------------------------+
|                         Frontend Client                               |
|            (React 19, TanStack Start/Router, Tailwind v4)              |
+-----------------------------------------------------------------------+
                                   |
                             Vite Dev Proxy
                              (/api -> :8080)
                                   |
+-----------------------------------------------------------------------+
|                      Spring Boot Backend (:8080)                      |
|                                                                       |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | Security / JWT     |  | Work Order Engine  |  | SLA Engine      |  |
|  | Multi-Tenant Filter|  | State Machine      |  | Scheduler Job   |  |
|  +--------------------+  +--------------------+  +-----------------+  |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | Inventory & Stock  |  | Customer & Tech    |  | Activity &      |  |
|  | Management         |  | Portals            |  | Notifications   |  |
|  +--------------------+  +--------------------+  +-----------------+  |
+-----------------------------------------------------------------------+
                                   |
                              Spring Data JPA
                                   |
+-----------------------------------------------------------------------+
|                         PostgreSQL 16 Database                        |
|                     (Managed via Flyway Migrations)                   |
+-----------------------------------------------------------------------+
```

---

## 2. Multi-Tenancy & Security Model

- **Organization Isolation**: Every data model entity (`WorkOrder`, `Customer`, `Asset`, `Part`, `ActivityLog`) references an `Organization`.
- **JWT Authentication**:
  - `POST /api/auth/login` issues access token (15-min lifespan) and refresh token (7-day lifespan).
  - Claims contain `userId`, `organizationId`, and `role`.
- **Role Hierarchy**:
  - `ROLE_ADMIN`: Complete read/write configuration access.
  - `ROLE_MANAGER`: Full operational, dispatch, and report access.
  - `ROLE_TECHNICIAN`: Scoped to assigned work orders, time tracking, and inventory usage.
  - `ROLE_CUSTOMER`: Scoped to owned assets and submitted service requests.

---

## 3. Core Engine Specifications

### Work Order State Machine
Allowed status transitions enforced by `WorkOrderStatusMachine`:
- `NEW` ➔ `ASSIGNED`, `SCHEDULED`, `IN_PROGRESS`, `CANCELLED`
- `ASSIGNED` ➔ `SCHEDULED`, `IN_PROGRESS`, `NEW`, `CANCELLED`
- `SCHEDULED` ➔ `IN_PROGRESS`, `ASSIGNED`, `ON_HOLD`, `CANCELLED`
- `IN_PROGRESS` ➔ `ON_HOLD`, `COMPLETED`, `CANCELLED`
- `ON_HOLD` ➔ `IN_PROGRESS`, `CANCELLED`
- `COMPLETED` ➔ `CLOSED`, `IN_PROGRESS`
- `CLOSED` & `CANCELLED` ➔ Terminal States

### SLA Engine & Calculation
1. SLA policy attached by priority (`CRITICAL`: 120m, `HIGH`: 240m, `MEDIUM`: 1440m, `LOW`: 2880m).
2. `SlaService.calculateDeadline()` computes deadline upon order creation.
3. SLA status computed dynamically:
   - `BREACHED`: Current time exceeds `slaDeadline` and order is not completed/closed.
   - `AT_RISK`: Remaining time is less than 20% of total allotted resolution duration.
   - `HEALTHY`: Healthy buffer remaining.
4. Background `@Scheduled` job (`SlaCheckScheduler`) scans active orders every 60 seconds and emits in-app notifications upon SLA breach.

### Inventory Transaction Safety
Adding a part to a Work Order (`POST /api/inventory/work-orders/{id}/parts`):
1. Verifies `quantityOnHand >= requestedQuantity`.
2. Deducts `quantityOnHand` in a single transactional write boundary `@Transactional`.
3. Records `WorkOrderPart` line item and logs to `ActivityLog`.

---

## 4. Frontend Integration Layer

- Native `fetch`-based `ApiClient` located at `src/api/client.ts`.
- Automatically attaches `Authorization: Bearer <JWT>`.
- Auto-redirects to `/login` on HTTP 401 Unauthorized responses.
- API endpoints modularized into `src/api/*.ts`.
