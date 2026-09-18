package com.keystone.asset;
import com.keystone.common.*;
import com.keystone.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/assets")
@RequiredArgsConstructor @Tag(name = "Assets") @SecurityRequirement(name = "bearerAuth")
public class AssetController {
    private final AssetService assetService;
    private final JwtTokenProvider tokenProvider;
    private UUID orgId(HttpServletRequest r) { return tokenProvider.getOrgId(r.getHeader("Authorization").substring(7)); }

    @GetMapping
    public ResponseEntity<PagedResponse<AssetDto.Response>> list(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, HttpServletRequest req) {
        Page<Asset> result = assetService.list(orgId(req), PageRequest.of(page, size, Sort.by("name")));
        return ResponseEntity.ok(new PagedResponse<>(result.getContent().stream().map(assetService::toDto).toList(), result.getTotalElements(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetDto.Response>> get(@PathVariable UUID id, HttpServletRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(assetService.toDto(assetService.getById(id, orgId(req)))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AssetDto.Response>> create(@RequestBody AssetDto.CreateRequest body, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(assetService.toDto(assetService.create(body, orgId(req)))));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetDto.Response>> update(@PathVariable UUID id, @RequestBody AssetDto.UpdateRequest body, HttpServletRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(assetService.toDto(assetService.update(id, body, orgId(req)))));
    }
}