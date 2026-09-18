package com.keystone.inventory;

import com.keystone.activity_log.ActivityLogService;
import com.keystone.common.KeystoneException;
import com.keystone.common.PagedResponse;
import com.keystone.organization.Organization;
import com.keystone.organization.OrganizationRepository;
import com.keystone.security.KeystonePrincipal;
import com.keystone.work_order.WorkOrder;
import com.keystone.work_order.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final PartRepository partRepository;
    private final WorkOrderPartRepository workOrderPartRepository;
    private final WorkOrderRepository workOrderRepository;
    private final OrganizationRepository organizationRepository;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public PagedResponse<InventoryDto.PartResponse> getParts(KeystonePrincipal principal, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<Part> partsPage = partRepository.findByOrganizationId(principal.organizationId(), pageable);

        List<InventoryDto.PartResponse> content = partsPage.getContent().stream()
                .map(this::toPartResponse)
                .toList();

        return PagedResponse.<InventoryDto.PartResponse>builder()
                .content(content)
                .page(partsPage.getNumber())
                .size(partsPage.getSize())
                .totalElements(partsPage.getTotalElements())
                .totalPages(partsPage.getTotalPages())
                .last(partsPage.isLast())
                .build();
    }

    @Transactional
    public InventoryDto.PartResponse createPart(KeystonePrincipal principal, InventoryDto.CreatePartRequest request) {
        Organization org = organizationRepository.findById(principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Organization not found"));

        Part part = Part.builder()
                .organization(org)
                .partNumber(request.getPartNumber())
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .unitPrice(request.getUnitPrice())
                .quantityOnHand(request.getQuantityOnHand())
                .reorderLevel(request.getReorderLevel())
                .build();

        Part saved = partRepository.save(part);
        activityLogService.log(principal, "PART", saved.getId(), "CREATED", "Created part " + saved.getPartNumber());

        return toPartResponse(saved);
    }

    @Transactional
    public InventoryDto.WorkOrderPartResponse addPartToWorkOrder(KeystonePrincipal principal, UUID workOrderId, InventoryDto.AddPartToWorkOrderRequest request) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(workOrderId, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        Part part = partRepository.findByIdAndOrganizationId(request.getPartId(), principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Part not found"));

        if (part.getQuantityOnHand() < request.getQuantity()) {
            throw new KeystoneException(HttpStatus.BAD_REQUEST,
                    String.format("Insufficient stock for part %s. Available: %d, Requested: %d",
                            part.getName(), part.getQuantityOnHand(), request.getQuantity()));
        }

        // Deduct stock transactionally
        part.setQuantityOnHand(part.getQuantityOnHand() - request.getQuantity());
        partRepository.save(part);

        WorkOrderPart woPart = WorkOrderPart.builder()
                .workOrder(wo)
                .part(part)
                .quantity(request.getQuantity())
                .unitPrice(part.getUnitPrice())
                .build();

        WorkOrderPart saved = workOrderPartRepository.save(woPart);

        activityLogService.log(principal, "WORK_ORDER_PART", saved.getId(), "ADDED",
                String.format("Used %d of %s on work order %s", request.getQuantity(), part.getName(), wo.getWorkOrderNumber()));

        return InventoryDto.WorkOrderPartResponse.builder()
                .id(saved.getId())
                .workOrderId(wo.getId())
                .partId(part.getId())
                .partNumber(part.getPartNumber())
                .partName(part.getName())
                .quantity(saved.getQuantity())
                .unitPrice(saved.getUnitPrice())
                .totalPrice(saved.getUnitPrice().multiply(BigDecimal.valueOf(saved.getQuantity())))
                .build();
    }

    @Transactional(readOnly = true)
    public List<InventoryDto.WorkOrderPartResponse> getWorkOrderParts(KeystonePrincipal principal, UUID workOrderId) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(workOrderId, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        return workOrderPartRepository.findByWorkOrderId(wo.getId()).stream()
                .map(wop -> InventoryDto.WorkOrderPartResponse.builder()
                        .id(wop.getId())
                        .workOrderId(wo.getId())
                        .partId(wop.getPart().getId())
                        .partNumber(wop.getPart().getPartNumber())
                        .partName(wop.getPart().getName())
                        .quantity(wop.getQuantity())
                        .unitPrice(wop.getUnitPrice())
                        .totalPrice(wop.getUnitPrice().multiply(BigDecimal.valueOf(wop.getQuantity())))
                        .build())
                .toList();
    }

    public InventoryDto.PartResponse toPartResponse(Part part) {
        return InventoryDto.PartResponse.builder()
                .id(part.getId())
                .partNumber(part.getPartNumber())
                .name(part.getName())
                .description(part.getDescription())
                .category(part.getCategory())
                .unitPrice(part.getUnitPrice())
                .quantityOnHand(part.getQuantityOnHand())
                .reorderLevel(part.getReorderLevel())
                .lowStock(part.getQuantityOnHand() <= part.getReorderLevel())
                .createdAt(part.getCreatedAt())
                .updatedAt(part.getUpdatedAt())
                .build();
    }
}