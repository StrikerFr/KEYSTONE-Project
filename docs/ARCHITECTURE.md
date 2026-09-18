# KEYSTONE Architecture Specification

## System Architecture

KEYSTONE is designed as an enterprise-grade multi-tenant Field Service Management platform using a modern decoupled architecture.

```mermaid
graph TD
    User[Browser / Client] -->|HTTP / React 19| Frontend[Vite Dev / TanStack Start]
    Frontend -->|/api Proxy| Security[Spring Security / JWT Filter]
    Security -->|Validated Claims| Controller[REST API Controllers]
    Controller -->|DTO Transfer| Service[Service Layer & Business Logic]
    Service -->|State Engine| SM[WorkOrder State Machine]
    Service -->|SLA Scheduler| SLA[SLA Calculation Engine]
    Service -->|Spring Data JPA| Repository[JPA Repositories]
    Repository -->|JDBC / Flyway| Database[(PostgreSQL 16 Database)]
```

---

## Technical Stack Overview

### Frontend Architecture
- **Framework**: React 19 + TanStack Start & Router
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design System
- **HTTP Layer**: Native `fetch` with centralized JWT Bearer interceptor (`src/api/client.ts`)
- **State Management**: TanStack Query + React Hooks

### Backend Architecture
- **Framework**: Spring Boot 3.3.4 (Java 21)
- **Security Layer**: Stateless JWT (`jsonwebtoken 0.12.6`), BCrypt Password Encoding
- **Multitenancy**: Organization isolation via tenant ID filtering on all entity repositories
- **Database Migrations**: Flyway SQL migrations (`V1` through `V17`)
- **API Specification**: OpenAPI 3.0 / Swagger UI (`springdoc-openapi-starter-webmvc-ui 2.6.0`)

---

## Data Flow Lifecycle

```mermaid
sequenceDiagram
    participant C as Customer / User
    participant FE as Frontend Client
    participant API as Spring Boot API
    participant DB as PostgreSQL 16 DB

    C->>FE: Submit Service Request
    FE->>API: POST /api/service-requests (JWT Attached)
    API->>API: Extract Organization ID from JWT
    API->>DB: INSERT INTO service_requests
    DB-->>API: ServiceRequest Entity
    API-->>FE: 201 Created (ApiResponse)
    FE-->>C: Display Request Confirmation Toast
```
