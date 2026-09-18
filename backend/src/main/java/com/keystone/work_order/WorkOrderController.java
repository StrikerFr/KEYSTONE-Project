package com.keystone.work_order;

import com.keystone.common.ApiResponse;
import com.keystone.common.PagedResponse;
import com.keystone.security.KeystonePrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<WorkOrderDto.Response>>> getWorkOrders(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) WorkOrderPriority priority,
            @RequestParam(required = false) UUID technicianId,
            @RequestParam(required = false) UUID customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PagedResponse<WorkOrderDto.Response> result = workOrderService.getWorkOrders(
                principal, status, priority, technicianId, customerId, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkOrderDto.Response>> getWorkOrderById(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(ApiResponse.success(workOrderService.getWorkOrderById(principal, id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<WorkOrderDto.Response>> createWorkOrder(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @Valid @RequestBody WorkOrderDto.CreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Work Order created successfully", workOrderService.createWorkOrder(principal, request)));
    }

    @PATCH("/{id}/status")
    public ResponseEntity<ApiResponse<WorkOrderDto.Response>> updateStatus(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody WorkOrderDto.StatusChangeRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", workOrderService.updateStatus(principal, id, request)));
    }

    @PATCH("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<WorkOrderDto.Response>> assignTechnician(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody WorkOrderDto.AssignRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Technician assigned", workOrderService.assignTechnician(principal, id, request.getTechnicianId())));
    }

    @PATCH("/{id}/schedule")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<WorkOrderDto.Response>> scheduleWorkOrder(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody WorkOrderDto.ScheduleRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Work Order scheduled", workOrderService.scheduleWorkOrder(principal, id, request)));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<WorkOrderDto.HistoryResponse>>> getStatusHistory(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(ApiResponse.success(workOrderService.getStatusHistory(principal, id)));
    }
}