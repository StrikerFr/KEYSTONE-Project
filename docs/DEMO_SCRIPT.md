# KEYSTONE 5-Minute Live Presentation & Demo Script

This script provides a structured 5-to-7 minute walkthrough for live project demonstrations, technical interviews, and evaluator reviews.

---

## ⏱️ Timeline & Presentation Flow

### 1. Introduction & Operational Vision (1 Min)
- **What to Show**: Landing page ([http://localhost:8080/](http://localhost:8080/)).
- **What to Say**: "KEYSTONE is an enterprise-grade Field Service Management platform designed to solve operational friction between customers, dispatchers, and field technicians."
- **Why it Matters**: Demonstrates problem domain understanding and high-end visual design.

---

### 2. Customer Request Flow (1 Min)
- **What to Show**: Customer Portal (`/customer/dashboard`).
- **What to Say**: "Customers can log in to view company assets and submit self-service requests. Watch as we log in as Priya Patel from Apex Industries and submit a service request for a cooling tower issue."
- **Action**: Submit a new Service Request (`SR-2026-000001`).

---

### 3. Dispatcher & Operations Dashboard (2 Mins)
- **What to Show**: Operations Dashboard (`/dashboard`) and Work Orders workspace (`/work-orders`).
- **What to Say**: "Switching to the Manager view (`manager@keystone.local`), the dispatcher sees live field metrics, SLA compliance, and the incoming service request. With one click, we convert the request into a Work Order (`WO-2026-000003`), assign technician Rahul Sharma, and schedule the job."
- **Action**: Convert SR ➔ Assign Tech ➔ Schedule Job.

---

### 4. Technician Mobile Workflow (1.5 Mins)
- **What to Show**: Technician Portal (`/technician/dashboard`).
- **What to Say**: "Rahul Sharma logs into his field workspace. He sees the newly assigned job, taps 'Start Work' to launch a billable time entry, logs 2 units of refrigerant oil from inventory, and completes the work with resolution notes."
- **Action**: Start Work ➔ Log Part ➔ Complete Work.

---

### 5. SLA Engine & Final Verification (1 Min)
- **What to Show**: Return to Operations Dashboard (`/dashboard`).
- **What to Say**: "Back in the central dashboard, the completed work order is reflected instantly. The background SLA scheduler has recorded compliance, inventory stock is updated, and audit logs capture every step of the execution."
- **Why it Matters**: Proves end-to-end full-stack integration and database transaction integrity.
