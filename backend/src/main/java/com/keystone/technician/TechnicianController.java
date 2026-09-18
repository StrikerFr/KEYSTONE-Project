package com.keystone.technician;
import com.keystone.common.ApiResponse;
import com.keystone.common.PagedResponse;
import com.keystone.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/technicians")
@RequiredArgsConstructor @Tag(name = "Technicians") @SecurityRequirement(name = "bearerAuth")
public class TechnicianController {
    private final TechnicianService technicianService;
    private final JwtTokenProvider tokenProvider;

    private UUID orgId(HttpServletRequest req) {
        return tokenProvider.getOrgId(req.getHeader("Authorization").substring(7));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<TechnicianDto.Response>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest req) {
        Page<Technician> result = technicianService.list(orgId(req),
            PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(new PagedResponse<>(
            result.getContent().stream().map(technicianService::toDto).toList(),
            result.getTotalElements(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TechnicianDto.Response>> get(
            @PathVariable UUID id, HttpServletRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
            technicianService.toDto(technicianService.getById(id, orgId(req)))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TechnicianDto.Response>> create(
            @Valid @RequestBody TechnicianDto.CreateRequest body, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(
            technicianService.toDto(technicianService.create(body, orgId(req)))));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TechnicianDto.Response>> update(
            @PathVariable UUID id, @RequestBody TechnicianDto.UpdateRequest body, HttpServletRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
            technicianService.toDto(technicianService.update(id, body, orgId(req)))));
    }
}