# KEYSTONE Inventory & Stock Management

## 1. Inventory Model
- **Part Entity**: Stores `partNumber`, `name`, `unitPrice`, `quantityOnHand`, `reorderLevel`.
- **WorkOrderPart Entity**: Maps part consumption per work order (`quantity`, `unitPrice`).

---

## 2. Transactional Stock Deduction Flow
When a technician adds a part to a Work Order (`POST /api/inventory/work-orders/{id}/parts`):
1. **Validation**: Check if `part.getQuantityOnHand() >= requestedQuantity`. If insufficient, throws `KeystoneException(HttpStatus.BAD_REQUEST)` with `INSUFFICIENT_INVENTORY`.
2. **Stock Decrement**: `part.setQuantityOnHand(quantityOnHand - requestedQuantity)` within a `@Transactional` block.
3. **Audit**: Creates `WorkOrderPart` record and appends to `ActivityLog`.
4. **Low Stock Notification**: If `quantityOnHand <= reorderLevel`, issues a warning notification.
