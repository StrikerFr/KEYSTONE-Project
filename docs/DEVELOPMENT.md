# KEYSTONE Developer Setup Guide

Follow this step-by-step guide to run KEYSTONE locally from a clean repository clone.

## Prerequisites
- **Node.js**: v18.0+ & npm
- **Docker Desktop**: v20.10+ (for running PostgreSQL and Backend via Docker Compose)
- **Java JDK**: 21 (optional, if building backend locally without Docker)
- **Maven**: 3.9+ (optional, included via Docker build)

---

## 1. Quick Start (Docker - Recommended)

### Step 1: Clone Repository
```bash
git clone https://github.com/keystone-fsm/keystone.git
cd keystone
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Step 3: Launch Backend & PostgreSQL
```bash
docker compose up -d --build
```
This starts:
- **PostgreSQL 16**: Port `5432` (`keystone_db`)
- **Spring Boot Backend**: Port `8080`
- **Flyway Database Migrations**: Automatically runs schemas & seed data.

Verify backend status:
```bash
curl http://localhost:8080/actuator/health
```

### Step 4: Launch Frontend
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 2. Pre-Seeded Development Test Accounts

All pre-seeded accounts belong to **Northstar Operations**.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@keystone.local` | `Keystone@2026!` |
| **Manager** | `manager@keystone.local` | `Keystone@2026!` |
| **Technician** | `technician@keystone.local` | `Keystone@2026!` |
| **Customer** | `customer@keystone.local` | `Keystone@2026!` |

---

## 3. OpenAPI / Swagger Documentation
When the backend is active, view interactive API documentation at:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
