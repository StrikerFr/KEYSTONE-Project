package com.keystone.report;

import com.keystone.common.ApiResponse;
import com.keystone.security.KeystonePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReportDto.SummaryReport>> getSummaryReport(
            @AuthenticationPrincipal KeystonePrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getSummaryReport(principal)));
    }
}