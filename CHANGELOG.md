# Changelog

All notable changes to the KEYSTONE Field Service Management Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-18

### Added
- **Spring Boot Backend**: Production Java 21 REST API server with Maven dependencies.
- **JWT Security & RBAC**: Stateless authentication with role-based access (`ADMIN`, `MANAGER`, `TECHNICIAN`, `CUSTOMER`).
- **Organization Multitenancy**: Tenant isolation across database entities.
- **Work Order State Machine**: Status transition validation (`NEW` ➔ `ASSIGNED` ➔ `SCHEDULED` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`) and sequential WO number generator.
- **SLA Engine & Background Scheduler**: Priority SLA calculation, dynamic status tracking (`HEALTHY`, `AT_RISK`, `BREACHED`), and 60-second background checker job (`SlaCheckScheduler.java`).
- **Schedule Conflict Prevention**: Technician schedule overlap validation (`TECHNICIAN_SCHEDULE_CONFLICT`).
- **Service Request Conversions**: Customer service request submission and manager conversion into active Work Orders.
- **Transactional Inventory**: Parts usage on Work Orders with transactional stock deduction.
- **Time Tracking**: Active timer enforcement and duration calculation per technician.
- **Flyway Database Migrations**: 17 SQL migrations (`V1` through `V17`) with Northstar Operations dataset.
- **Frontend REST Layer**: Centralized fetch API client (`src/api/client.ts`) and domain modules connected to UI components.
- **Containerization**: Multi-stage `Dockerfile` and `docker-compose.yml` for PostgreSQL 16 and backend service.
- **Documentation Suite**: Architecture, API, Database, Security, Deployment, Development, SLA, and Demo Script documentation.
