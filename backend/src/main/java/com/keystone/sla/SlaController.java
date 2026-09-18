package com.keystone.sla;
import com.keystone.common.ApiResponse;
import com.keystone.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/sla")
@RequiredArgsConstructor @Tag(name = "SLA") @SecurityRequirement(name = "bearerAuth")
public class SlaController {
    private final SlaPolicyRepository slaPolicyRepository;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<List<SlaPolicy>>> getPolicies(HttpServletRequest req) {
        UUID orgId = tokenProvider.getOrgId(req.getHeader("Authorization").substring(7));
        return ResponseEntity.ok(ApiResponse.ok(slaPolicyRepository.findByOrganizationId(orgId)));
    }
}