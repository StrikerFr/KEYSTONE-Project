# KEYSTONE — Project Submission Document

## 1. Project Metadata
- **Project Title**: KEYSTONE — Field Service Management Platform
- **Project Type**: Full-Stack Enterprise Web Application
- **Domain**: Operations Management / Field Service Automation

---

## 2. Problem Statement & Solution

### Problem
Field service organizations suffer from fragmented customer requests, manual dispatch errors, poor SLA visibility, untracked inventory consumption, and uncoordinated technician scheduling.

### Solution
KEYSTONE provides a unified full-stack platform coordinating work orders, customer service requests, automated SLA monitoring, technician dispatching with schedule conflict detection, transactional inventory deduction, time tracking, and multi-role portals.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, TanStack Start & Router, Tailwind CSS v4, Lucide Icons, Recharts, Sonner Toasts
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security, Spring Data JPA, JWT, Lombok
- **Database**: PostgreSQL 16, Flyway SQL Migrations (V1..V17)
- **Containerization**: Docker, Multi-Stage Dockerfile, Docker Compose
- **API Spec**: OpenAPI 3.0 / Swagger UI

---

## 4. Key Accomplishments & Metrics

- **73 Acceptance Criteria Met**: Complete end-to-end full-stack integration.
- **Multitenancy & Security**: Statutory organization-level data isolation and JWT role enforcement.
- **100% Visual Preservation**: Preserved exact design identity, theme tokens, micro-interactions, and page layouts.
- **Production Build**: Verified clean compilation (`npm run build` & backend tests).

---

## 5. Development Test Credentials (Local / Demo Only)

Password for all accounts: `Keystone@2026!`

- **Admin**: `admin@keystone.local`
- **Manager**: `manager@keystone.local`
- **Technician**: `technician@keystone.local`
- **Customer**: `customer@keystone.local`
