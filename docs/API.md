# KEYSTONE REST API Reference Manual

The KEYSTONE REST API provides standardized, secure JSON endpoints for field service operations.

All API responses follow the standard `ApiResponse<T>` wrapper:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-09-18T12:00:00Z"
}
```

---

## Endpoint Catalog

### Authentication
- `POST /api/auth/login` — Authenticate credentials & issue access/refresh JWT tokens.
- `GET /api/auth/me` — Retrieve current authenticated user profile & tenant info.

### Dashboard Operations
- `GET /api/dashboard/summary` — Fetch operational metrics, SLA health distribution, and recent activity log.

### Work Orders
- `GET /api/work-orders` — List work orders (paginated, supports `status`, `priority`, `technicianId`, `customerId`).
- `GET /api/work-orders/{id}` — Fetch work order details by UUID.
- `POST /api/work-orders` — Create new work order (`ADMIN`, `MANAGER`).
- `PATCH /api/work-orders/{id}/status` — Transition work order status (`NEW` ➔ `ASSIGNED` ➔ `SCHEDULED` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`).
- `PATCH /api/work-orders/{id}/assign` — Assign technician to work order (`ADMIN`, `MANAGER`).
- `PATCH /api/work-orders/{id}/schedule` — Schedule work order execution window with overlap detection (`ADMIN`, `MANAGER`).
- `GET /api/work-orders/{id}/history` — Retrieve status transition audit timeline.

### Service Requests
- `GET /api/service-requests` — List customer service requests.
- `POST /api/service-requests` — Submit customer service request.
- `POST /api/service-requests/{id}/convert` — Convert service request into active Work Order (`ADMIN`, `MANAGER`).

### Technicians & Customers
- `GET /api/technicians` — List organization technicians & skill sets.
- `GET /api/customers` — List organization customer directory.

### Assets & Inventory
- `GET /api/assets` — List tracked customer assets and service due dates.
- `GET /api/inventory/parts` — List inventory parts and stock levels.
- `POST /api/inventory/parts` — Add new part to inventory (`ADMIN`, `MANAGER`).
- `POST /api/inventory/work-orders/{id}/parts` — Record part usage on work order (transactional stock deduction).

### Time Tracking & SLA
- `POST /api/time-tracking/work-orders/{id}/start` — Start work timer on assigned work order.
- `POST /api/time-tracking/entries/{id}/stop` — Stop work timer & record billable duration.
- `GET /api/sla/policies` — List organization SLA policies.

### Notifications & Reports
- `GET /api/notifications` — Retrieve user notifications.
- `PATCH /api/notifications/{id}/read` — Mark single notification as read.
- `PATCH /api/notifications/read-all` — Mark all notifications as read.
- `GET /api/reports/summary` — Fetch analytical summary report (`ADMIN`, `MANAGER`).
