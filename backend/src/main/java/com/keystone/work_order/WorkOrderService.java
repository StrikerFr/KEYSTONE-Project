package com.keystone.work_order;

import com.keystone.activity_log.ActivityLogService;
import com.keystone.asset.Asset;
import com.keystone.asset.AssetRepository;
import com.keystone.asset.AssetService;
import com.keystone.common.KeystoneException;
import com.keystone.common.PagedResponse;
import com.keystone.customer.Customer;
import com.keystone.customer.CustomerRepository;
import com.keystone.customer.CustomerService;
import com.keystone.notification.NotificationService;
import com.keystone.organization.Organization;
import com.keystone.organization.OrganizationRepository;
import com.keystone.security.KeystonePrincipal;
import com.keystone.sla.SlaPolicy;
import com.keystone.sla.SlaPolicyRepository;
import com.keystone.sla.SlaPolicyDto;
import com.keystone.sla.SlaService;
import com.keystone.technician.Technician;
import com.keystone.technician.TechnicianRepository;
import com.keystone.technician.TechnicianService;
import com.keystone.user.User;
import com.keystone.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;
    private final OrganizationRepository organizationRepository;
    private final CustomerRepository customerRepository;
    private final TechnicianRepository technicianRepository;
    private final AssetRepository assetRepository;
    private final SlaPolicyRepository slaPolicyRepository;
    private final UserRepository userRepository;
    private final SlaService slaService;
    private final CustomerService customerService;
    private final TechnicianService technicianService;
    private final AssetService assetService;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    private static final AtomicLong COUNTER = new AtomicLong(System.currentTimeMillis() % 10000);

    @Transactional(readOnly = true)
    public PagedResponse<WorkOrderDto.Response> getWorkOrders(
            KeystonePrincipal principal,
            WorkOrderStatus status,
            WorkOrderPriority priority,
            UUID technicianId,
            UUID customerId,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<WorkOrder> woPage;

        if (principal.isTechnician()) {
            Technician tech = technicianRepository.findByUserId(principal.userId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Technician record not found"));
            woPage = workOrderRepository.findByOrganizationIdAndAssignedTechnicianId(principal.organizationId(), tech.getId(), pageable);
        } else if (principal.isCustomer()) {
            Customer cust = customerRepository.findByUserId(principal.userId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Customer record not found"));
            woPage = workOrderRepository.findByOrganizationIdAndCustomerId(principal.organizationId(), cust.getId(), pageable);
        } else if (status != null) {
            woPage = workOrderRepository.findByOrganizationIdAndStatus(principal.organizationId(), status, pageable);
        } else {
            woPage = workOrderRepository.findByOrganizationId(principal.organizationId(), pageable);
        }

        List<WorkOrderDto.Response> content = woPage.getContent().stream()
                .map(this::toResponseDto)
                .toList();

        return PagedResponse.<WorkOrderDto.Response>builder()
                .content(content)
                .page(woPage.getNumber())
                .size(woPage.getSize())
                .totalElements(woPage.getTotalElements())
                .totalPages(woPage.getTotalPages())
                .last(woPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public WorkOrderDto.Response getWorkOrderById(KeystonePrincipal principal, UUID id) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(id, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found with ID: " + id));
        return toResponseDto(wo);
    }

    @Transactional
    public WorkOrderDto.Response createWorkOrder(KeystonePrincipal principal, WorkOrderDto.CreateRequest request) {
        Organization org = organizationRepository.findById(principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Organization not found"));

        Customer customer = customerRepository.findByIdAndOrganizationId(request.getCustomerId(), principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Customer not found"));

        Technician technician = null;
        if (request.getAssignedTechnicianId() != null) {
            technician = technicianRepository.findByIdAndOrganizationId(request.getAssignedTechnicianId(), principal.organizationId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Technician not found"));
        }

        Asset asset = null;
        if (request.getAssetId() != null) {
            asset = assetRepository.findByIdAndOrganizationId(request.getAssetId(), principal.organizationId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Asset not found"));
        }

        SlaPolicy slaPolicy = null;
        if (request.getSlaPolicyId() != null) {
            slaPolicy = slaPolicyRepository.findByIdAndOrganizationId(request.getSlaPolicyId(), principal.organizationId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "SLA Policy not found"));
        } else {
            slaPolicy = slaPolicyRepository.findByOrganizationIdAndPriority(principal.organizationId(), request.getPriority())
                    .orElse(null);
        }

        String woNumber = generateWorkOrderNumber();
        WorkOrderStatus initialStatus = (technician != null) ? WorkOrderStatus.ASSIGNED : WorkOrderStatus.NEW;
        LocalDateTime slaDeadline = slaPolicy != null ? slaService.calculateDeadline(slaPolicy, LocalDateTime.now()) : null;

        WorkOrder workOrder = WorkOrder.builder()
                .workOrderNumber(woNumber)
                .organization(org)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(initialStatus)
                .priority(request.getPriority())
                .customer(customer)
                .assignedTechnician(technician)
                .asset(asset)
                .slaPolicy(slaPolicy)
                .slaDeadline(slaDeadline)
                .scheduledStart(request.getScheduledStart())
                .scheduledEnd(request.getScheduledEnd())
                .locationAddress(request.getLocationAddress())
                .locationLatitude(request.getLocationLatitude())
                .locationLongitude(request.getLocationLongitude())
                .build();

        WorkOrder saved = workOrderRepository.save(workOrder);

        recordStatusHistory(saved, null, initialStatus, principal.userId(), "Work Order created");
        activityLogService.log(principal, "WORK_ORDER", saved.getId(), "CREATED", "Created work order " + saved.getWorkOrderNumber());

        if (technician != null && technician.getUser() != null) {
            notificationService.notifyUser(
                    technician.getUser().getId(),
                    "New Work Order Assigned",
                    "You have been assigned to work order " + saved.getWorkOrderNumber(),
                    "WORK_ORDER",
                    saved.getId()
            );
        }

        return toResponseDto(saved);
    }

    @Transactional
    public WorkOrderDto.Response updateStatus(KeystonePrincipal principal, UUID id, WorkOrderDto.StatusChangeRequest request) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(id, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        WorkOrderStatus oldStatus = wo.getStatus();
        WorkOrderStatus newStatus = request.getStatus();

        WorkOrderStatusMachine.validateTransition(oldStatus, newStatus);

        wo.setStatus(newStatus);
        LocalDateTime now = LocalDateTime.now();

        if (newStatus == WorkOrderStatus.IN_PROGRESS && wo.getActualStart() == null) {
            wo.setActualStart(now);
        } else if (newStatus == WorkOrderStatus.COMPLETED) {
            wo.setActualEnd(now);
            wo.setCompletedAt(now);
            if (request.getResolutionNotes() != null) {
                wo.setResolutionNotes(request.getResolutionNotes());
            }
            if (request.getCustomerSignature() != null) {
                wo.setCustomerSignature(request.getCustomerSignature());
            }
        }

        WorkOrder updated = workOrderRepository.save(wo);
        recordStatusHistory(updated, oldStatus, newStatus, principal.userId(), request.getNotes());
        activityLogService.log(principal, "WORK_ORDER", updated.getId(), "STATUS_CHANGE",
                String.format("Status changed from %s to %s for %s", oldStatus, newStatus, updated.getWorkOrderNumber()));

        return toResponseDto(updated);
    }

    @Transactional
    public WorkOrderDto.Response assignTechnician(KeystonePrincipal principal, UUID id, UUID technicianId) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(id, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        Technician tech = technicianRepository.findByIdAndOrganizationId(technicianId, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Technician not found"));

        wo.setAssignedTechnician(tech);
        if (wo.getStatus() == WorkOrderStatus.NEW) {
            WorkOrderStatusMachine.validateTransition(wo.getStatus(), WorkOrderStatus.ASSIGNED);
            wo.setStatus(WorkOrderStatus.ASSIGNED);
            recordStatusHistory(wo, WorkOrderStatus.NEW, WorkOrderStatus.ASSIGNED, principal.userId(), "Assigned to " + tech.getFirstName() + " " + tech.getLastName());
        }

        WorkOrder updated = workOrderRepository.save(wo);
        activityLogService.log(principal, "WORK_ORDER", updated.getId(), "ASSIGNED",
                "Assigned to technician " + tech.getFirstName() + " " + tech.getLastName());

        if (tech.getUser() != null) {
            notificationService.notifyUser(
                    tech.getUser().getId(),
                    "Work Order Assigned",
                    "You were assigned to work order " + updated.getWorkOrderNumber(),
                    "WORK_ORDER",
                    updated.getId()
            );
        }

        return toResponseDto(updated);
    }

    @Transactional
    public WorkOrderDto.Response scheduleWorkOrder(KeystonePrincipal principal, UUID id, WorkOrderDto.ScheduleRequest request) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(id, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        Technician tech = wo.getAssignedTechnician();
        if (request.getTechnicianId() != null) {
            tech = technicianRepository.findByIdAndOrganizationId(request.getTechnicianId(), principal.organizationId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Technician not found"));
            wo.setAssignedTechnician(tech);
        }

        if (tech != null && request.getScheduledStart() != null && request.getScheduledEnd() != null) {
            validateNoScheduleConflict(principal.organizationId(), tech.getId(), wo.getId(), request.getScheduledStart(), request.getScheduledEnd(), tech.getFirstName() + " " + tech.getLastName());
        }

        wo.setScheduledStart(request.getScheduledStart());
        wo.setScheduledEnd(request.getScheduledEnd());

        if (wo.getStatus() == WorkOrderStatus.NEW || wo.getStatus() == WorkOrderStatus.ASSIGNED) {
            WorkOrderStatus oldStatus = wo.getStatus();
            wo.setStatus(WorkOrderStatus.SCHEDULED);
            recordStatusHistory(wo, oldStatus, WorkOrderStatus.SCHEDULED, principal.userId(), "Scheduled work order");
        }

        WorkOrder updated = workOrderRepository.save(wo);
        activityLogService.log(principal, "WORK_ORDER", updated.getId(), "SCHEDULED",
                String.format("Scheduled work order %s for %s to %s", updated.getWorkOrderNumber(), request.getScheduledStart(), request.getScheduledEnd()));

        return toResponseDto(updated);
    }

    private void validateNoScheduleConflict(UUID orgId, UUID techId, UUID woId, LocalDateTime start, LocalDateTime end, String techName) {
        List<WorkOrder> conflicts = workOrderRepository.findOverlappingTechnicianWorkOrders(orgId, techId, woId != null ? woId : UUID.randomUUID(), start, end);
        if (!conflicts.isEmpty()) {
            throw new KeystoneException(
                    HttpStatus.CONFLICT,
                    String.format("TECHNICIAN_SCHEDULE_CONFLICT: Technician %s is already scheduled for job %s during this time", techName, conflicts.get(0).getWorkOrderNumber())
            );
        }
    }

    @Transactional(readOnly = true)
    public List<WorkOrderDto.HistoryResponse> getStatusHistory(KeystonePrincipal principal, UUID workOrderId) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(workOrderId, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        return historyRepository.findByWorkOrderIdOrderByCreatedAtDesc(wo.getId()).stream()
                .map(h -> WorkOrderDto.HistoryResponse.builder()
                        .id(h.getId())
                        .workOrderId(h.getWorkOrder().getId())
                        .fromStatus(h.getFromStatus())
                        .toStatus(h.getToStatus())
                        .changedByName(h.getChangedBy() != null ? h.getChangedBy().getFirstName() + " " + h.getChangedBy().getLastName() : "System")
                        .notes(h.getNotes())
                        .createdAt(h.getCreatedAt())
                        .build())
                .toList();
    }

    private void recordStatusHistory(WorkOrder wo, WorkOrderStatus from, WorkOrderStatus to, UUID userId, String notes) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        WorkOrderStatusHistory history = WorkOrderStatusHistory.builder()
                .workOrder(wo)
                .fromStatus(from)
                .toStatus(to)
                .changedBy(user)
                .notes(notes)
                .build();
        historyRepository.save(history);
    }

    private String generateWorkOrderNumber() {
        String year = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy"));
        long seq = COUNTER.incrementAndGet();
        return String.format("WO-%s-%06d", year, seq);
    }

    public WorkOrderDto.Response toResponseDto(WorkOrder wo) {
        return WorkOrderDto.Response.builder()
                .id(wo.getId())
                .workOrderNumber(wo.getWorkOrderNumber())
                .organizationId(wo.getOrganization().getId())
                .title(wo.getTitle())
                .description(wo.getDescription())
                .status(wo.getStatus())
                .priority(wo.getPriority())
                .customer(customerService.toDto(wo.getCustomer()))
                .assignedTechnician(wo.getAssignedTechnician() != null ? technicianService.toDto(wo.getAssignedTechnician()) : null)
                .asset(wo.getAsset() != null ? assetService.toDto(wo.getAsset()) : null)
                .slaPolicy(wo.getSlaPolicy() != null ? SlaPolicyDto.fromEntity(wo.getSlaPolicy()) : null)
                .slaDeadline(wo.getSlaDeadline())
                .slaStatus(slaService.computeStatus(wo.getSlaDeadline(), wo.getCreatedAt()))
                .remainingSlaMinutes(slaService.getRemainingMinutes(wo.getSlaDeadline()))
                .scheduledStart(wo.getScheduledStart())
                .scheduledEnd(wo.getScheduledEnd())
                .actualStart(wo.getActualStart())
                .actualEnd(wo.getActualEnd())
                .completedAt(wo.getCompletedAt())
                .locationAddress(wo.getLocationAddress())
                .locationLatitude(wo.getLocationLatitude())
                .locationLongitude(wo.getLocationLongitude())
                .resolutionNotes(wo.getResolutionNotes())
                .customerSignature(wo.getCustomerSignature())
                .createdAt(wo.getCreatedAt())
                .updatedAt(wo.getUpdatedAt())
                .build();
    }
}