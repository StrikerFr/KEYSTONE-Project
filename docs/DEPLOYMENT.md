# KEYSTONE Production Deployment Guide

## Production Architecture Diagram

```
                 INTERNET / CLIENTS
                         │
                         ▼
                HTTPS / NGINX / CDN
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
Frontend Host                    Spring Boot API Server
(Static Assets / Vercel)         (Docker / ECS / K8s :8080)
                                          │
                                          ▼
                               Managed PostgreSQL 16
                               (AWS RDS / GCP Cloud SQL)
```

---

## 1. Environment Variable Checklist

Before deploying, set the following environment variables on the production backend host:

| Variable | Description | Example Production Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | JDBC connection string | `jdbc:postgresql://db.example.com:5432/keystone_prod` |
| `DATABASE_USERNAME` | Database username | `keystone_db_user` |
| `DATABASE_PASSWORD` | Strong database password | `SuperSecretPassword2026!` |
| `JWT_SECRET` | 256-bit secret key | `Random64CharHexString...` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend domains | `https://keystone.example.com` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `prod` |

---

## 2. Database Provisioning & Migrations
- Provision PostgreSQL 16 database with SSL enabled (`sslmode=verify-full`).
- Flyway automatically runs pending SQL migrations (`V1`..`V17`) on container startup.

---

## 3. Container Deployment
Build & run backend Docker container:
```bash
docker build -t keystone-backend:latest ./backend
docker run -d -p 8080:8080 --env-file .env.prod keystone-backend:latest
```

---

## 4. Vercel Deployment (Frontend)

The frontend is fully configured for Vercel deployment:

1. **Import Repository**: Connect your GitHub repository to Vercel.
2. **Framework Preset**: Select `Vite` or `Other`.
3. **Build Command**: `npm run build` (or `npm run vercel-build`).
4. **Output Directory**: `.output/public`.
5. **Environment Variables**:
   - `VITE_API_URL`: URL of your production Spring Boot API endpoint (e.g., `https://api.keystone.example.com/api`).
6. **Vercel Config**: `vercel.json` automatically configures clean URLs and client-side routing rewrites.

