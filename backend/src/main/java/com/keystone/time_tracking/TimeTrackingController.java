package com.keystone.time_tracking;

import com.keystone.common.ApiResponse;
import com.keystone.security.KeystonePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/time-tracking")
@RequiredArgsConstructor
public class TimeTrackingController {

    private final TimeTrackingService timeTrackingService;

    @PostMapping("/work-orders/{workOrderId}/start")
    public ResponseEntity<ApiResponse<TimeTrackingDto.Response>> startTime(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID workOrderId,
            @RequestBody(required = false) TimeTrackingDto.StartRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Timer started", timeTrackingService.startTime(principal, workOrderId, request)));
    }

    @PostMapping("/entries/{id}/stop")
    public ResponseEntity<ApiResponse<TimeTrackingDto.Response>> stopTime(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID id,
            @RequestBody(required = false) TimeTrackingDto.StopRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Timer stopped", timeTrackingService.stopTime(principal, id, request)));
    }

    @GetMapping("/work-orders/{workOrderId}")
    public ResponseEntity<ApiResponse<List<TimeTrackingDto.Response>>> getEntries(
            @AuthenticationPrincipal KeystonePrincipal principal,
            @PathVariable UUID workOrderId
    ) {
        return ResponseEntity.ok(ApiResponse.success(timeTrackingService.getWorkOrderTimeEntries(principal, workOrderId)));
    }
}