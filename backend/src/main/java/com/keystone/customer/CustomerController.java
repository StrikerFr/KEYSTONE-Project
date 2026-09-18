package com.keystone.customer;
import com.keystone.common.ApiResponse;
import com.keystone.common.PagedResponse;
import com.keystone.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/customers")
@RequiredArgsConstructor @Tag(name = "Customers")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {
    private final CustomerService customerService;
    private final JwtTokenProvider tokenProvider;

    private UUID orgId(HttpServletRequest req) {
        String token = req.getHeader("Authorization").substring(7);
        return tokenProvider.getOrgId(token);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<CustomerDto.Response>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q,
            HttpServletRequest req) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("name"));
        Page<Customer> result = customerService.list(orgId(req), q, pr);
        return ResponseEntity.ok(new PagedResponse<>(
            result.getContent().stream().map(customerService::toDto).toList(),
            result.getTotalElements(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto.Response>> get(
            @PathVariable UUID id, HttpServletRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
            customerService.toDto(customerService.getById(id, orgId(req)))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerDto.Response>> create(
            @Valid @RequestBody CustomerDto.CreateRequest body, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(
            customerService.toDto(customerService.create(body, orgId(req)))));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto.Response>> update(
            @PathVariable UUID id, @RequestBody CustomerDto.UpdateRequest body,
            HttpServletRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
            customerService.toDto(customerService.update(id, body, orgId(req)))));
    }
}