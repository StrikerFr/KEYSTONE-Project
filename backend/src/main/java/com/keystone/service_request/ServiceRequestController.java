package com.keystone.service_request;

import com.keystone.common.ApiResponse;
import com.keystone.common.PagedResponse;
import com.keystone.security.KeystonePrincipal;
import com.keystone.work_order.WorkOrderDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/service-requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ServiceRequestDto.Response>>> getRequests(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(serviceRequestService.getRequests(principal, page, size)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceRequestDto.Response>> createRequest(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @Valid @RequestBody ServiceRequestDto.CreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service request submitted successfully", serviceRequestService.createRequest(principal, request)));
    }

    @PostMapping("/{id}/convert")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<WorkOrderDto.Response>> convertToWorkOrder(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(ApiResponse.success("Service request converted to work order", serviceRequestService.convertToWorkOrder(principal, id)));
    }
}