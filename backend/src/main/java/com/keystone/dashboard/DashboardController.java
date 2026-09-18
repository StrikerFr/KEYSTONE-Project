package com.keystone.dashboard;

import com.keystone.common.ApiResponse;
import com.keystone.security.KeystonePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardDto.OverviewData>> getOverview(
            @AuthenticationPrincipal KeystonePrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getOverview(principal)));
    }
}