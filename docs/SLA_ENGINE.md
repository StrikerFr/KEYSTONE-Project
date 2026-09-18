# KEYSTONE SLA Engine Architecture

## 1. SLA Calculation Logic

When a Work Order is created, the system calculates `slaDeadline` based on the selected `SlaPolicy`:
$$\text{slaDeadline} = \text{createdAt} + \text{resolutionTimeMinutes}$$

### Default Priority SLAs:
- **CRITICAL**: 15 min response / 120 min (2h) resolution
- **HIGH**: 30 min response / 240 min (4h) resolution
- **MEDIUM**: 120 min response / 1440 min (24h) resolution
- **LOW**: 240 min response / 2880 min (48h) resolution

---

## 2. Dynamic SLA Health Computation

SLA health status is evaluated dynamically:
- **`BREACHED`**: Current time exceeds `slaDeadline` and Work Order is not `COMPLETED`, `CLOSED`, or `CANCELLED`.
- **`AT_RISK`**: Remaining resolution window is less than 20% of total duration (or within 4 hours).
- **`HEALTHY`**: Resolution window has ample buffer remaining.

---

## 3. Automated Background Scheduler Job

- **Component**: `SlaCheckScheduler.java` (`@Scheduled(fixedRate = 60000)`)
- **Behavior**: Scans active work orders across organizations every 60 seconds.
- **Alert Trigger**: Automatically generates `Notification` entries (`SLA_BREACHED`, `SLA_WARNING`) when deadlines are exceeded or near breach.
