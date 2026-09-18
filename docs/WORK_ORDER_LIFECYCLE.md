# KEYSTONE Work Order Lifecycle & State Machine

## 1. Status Flow Diagram

```
[ NEW ] ───> [ ASSIGNED ] ───> [ SCHEDULED ] ───> [ IN_PROGRESS ] ───> [ COMPLETED ] ───> [ CLOSED ]
   │               │                 │                  │
   └───────────────┴─────────────────┴──────────────────┼───> [ CANCELLED ]
                                                        │
                                                        └───> [ ON_HOLD ] ───> [ IN_PROGRESS ]
```

---

## 2. Transition Rules Matrix

| From Status | Allowed Target Statuses | Validation Trigger |
| :--- | :--- | :--- |
| `NEW` | `ASSIGNED`, `SCHEDULED`, `IN_PROGRESS`, `CANCELLED` | Technician assigned or work started |
| `ASSIGNED` | `SCHEDULED`, `IN_PROGRESS`, `NEW`, `CANCELLED` | Schedule time set or reassigned |
| `SCHEDULED` | `IN_PROGRESS`, `ASSIGNED`, `ON_HOLD`, `CANCELLED` | Technician clicks "Start Work" |
| `IN_PROGRESS` | `ON_HOLD`, `COMPLETED`, `CANCELLED` | Work paused or resolution notes added |
| `ON_HOLD` | `IN_PROGRESS`, `CANCELLED` | Work resumed by technician |
| `COMPLETED` | `CLOSED`, `IN_PROGRESS` | Manager verification or rework |
| `CLOSED` | *None (Terminal State)* | Immutable |
| `CANCELLED` | *None (Terminal State)* | Immutable |

Invalid transitions (e.g. `NEW` ➔ `COMPLETED` or `CLOSED` ➔ `IN_PROGRESS`) throw `KeystoneException(HttpStatus.BAD_REQUEST)` with code `INVALID_STATUS_TRANSITION`.

---

## 3. Audit Logging & Status History
Every transition automatically writes an entry to `WorkOrderStatusHistory` and records a detailed audit message in `ActivityLog`.
