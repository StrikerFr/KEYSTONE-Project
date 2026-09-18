package com.keystone.inventory;

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
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/parts")
    public ResponseEntity<ApiResponse<PagedResponse<InventoryDto.PartResponse>>> getParts(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getParts(principal, page, size)));
    }

    @PostMapping("/parts")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InventoryDto.PartResponse>> createPart(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @Valid @RequestBody InventoryDto.CreatePartRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Part created successfully", inventoryService.createPart(principal, request)));
    }

    @PostMapping("/work-orders/{workOrderId}/parts")
    public ResponseEntity<ApiResponse<InventoryDto.WorkOrderPartResponse>> addPartToWorkOrder(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID workOrderId,
            @Valid @RequestBody InventoryDto.AddPartToWorkOrderRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Part added to work order", inventoryService.addPartToWorkOrder(principal, workOrderId, request)));
    }

    @GetMapping("/work-orders/{workOrderId}/parts")
    public ResponseEntity<ApiResponse<List<InventoryDto.WorkOrderPartResponse>>> getWorkOrderParts(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID workOrderId
    ) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getWorkOrderParts(principal, workOrderId)));
    }
}