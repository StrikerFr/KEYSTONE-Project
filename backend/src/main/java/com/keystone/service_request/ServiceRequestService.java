package com.keystone.service_request;

import com.keystone.activity_log.ActivityLogService;
import com.keystone.common.KeystoneException;
import com.keystone.common.PagedResponse;
import com.keystone.customer.Customer;
import com.keystone.customer.CustomerRepository;
import com.keystone.customer.CustomerService;
import com.keystone.organization.Organization;
import com.keystone.organization.OrganizationRepository;
import com.keystone.security.KeystonePrincipal;
import com.keystone.work_order.WorkOrderDto;
import com.keystone.work_order.WorkOrderPriority;
import com.keystone.work_order.WorkOrderService;
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
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final OrganizationRepository organizationRepository;
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final WorkOrderService workOrderService;
    private final ActivityLogService activityLogService;

    private static final AtomicLong COUNTER = new AtomicLong(System.currentTimeMillis() % 10000);

    @Transactional(readOnly = true)
    public PagedResponse<ServiceRequestDto.Response> getRequests(KeystonePrincipal principal, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ServiceRequest> pageResult;

        if (principal.isCustomer()) {
            Customer customer = customerRepository.findByUserId(principal.userId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Customer record not found"));
            pageResult = serviceRequestRepository.findByOrganizationIdAndCustomerId(principal.organizationId(), customer.getId(), pageable);
        } else {
            pageResult = serviceRequestRepository.findByOrganizationId(principal.organizationId(), pageable);
        }

        List<ServiceRequestDto.Response> content = pageResult.getContent().stream()
                .map(this::toDto)
                .toList();

        return PagedResponse.<ServiceRequestDto.Response>builder()
                .content(content)
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .last(pageResult.isLast())
                .build();
    }

    @Transactional
    public ServiceRequestDto.Response createRequest(KeystonePrincipal principal, ServiceRequestDto.CreateRequest request) {
        Organization org = organizationRepository.findById(principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Organization not found"));

        Customer customer;
        if (principal.isCustomer()) {
            customer = customerRepository.findByUserId(principal.userId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Customer record not found"));
        } else {
            if (request.getCustomerId() == null) {
                throw new KeystoneException(HttpStatus.BAD_REQUEST, "Customer ID is required");
            }
            customer = customerRepository.findByIdAndOrganizationId(request.getCustomerId(), principal.organizationId())
                    .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Customer not found"));
        }

        String reqNum = "SR-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy")) + "-" + String.format("%06d", COUNTER.incrementAndGet());

        ServiceRequest sr = ServiceRequest.builder()
                .requestNumber(reqNum)
                .organization(org)
                .customer(customer)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(ServiceRequestStatus.PENDING)
                .priority(request.getPriority() != null ? request.getPriority() : WorkOrderPriority.MEDIUM)
                .locationAddress(request.getLocationAddress())
                .build();

        ServiceRequest saved = serviceRequestRepository.save(sr);
        activityLogService.log(principal, "SERVICE_REQUEST", saved.getId(), "CREATED", "Created service request " + saved.getRequestNumber());

        return toDto(saved);
    }

    @Transactional
    public WorkOrderDto.Response convertToWorkOrder(KeystonePrincipal principal, UUID requestId) {
        ServiceRequest sr = serviceRequestRepository.findByIdAndOrganizationId(requestId, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Service Request not found"));

        if (sr.getStatus() == ServiceRequestStatus.CONVERTED) {
            throw new KeystoneException(HttpStatus.BAD_REQUEST, "Service request has already been converted to a work order");
        }

        WorkOrderDto.CreateRequest createWO = WorkOrderDto.CreateRequest.builder()
                .title(sr.getTitle())
                .description(sr.getDescription())
                .priority(sr.getPriority())
                .customerId(sr.getCustomer().getId())
                .locationAddress(sr.getLocationAddress())
                .build();

        WorkOrderDto.Response woResponse = workOrderService.createWorkOrder(principal, createWO);

        sr.setStatus(ServiceRequestStatus.CONVERTED);
        serviceRequestRepository.save(sr);

        activityLogService.log(principal, "SERVICE_REQUEST", sr.getId(), "CONVERTED",
                "Converted service request " + sr.getRequestNumber() + " to work order " + woResponse.getWorkOrderNumber());

        return woResponse;
    }

    private ServiceRequestDto.Response toDto(ServiceRequest sr) {
        return ServiceRequestDto.Response.builder()
                .id(sr.getId())
                .requestNumber(sr.getRequestNumber())
                .customer(customerService.toDto(sr.getCustomer()))
                .title(sr.getTitle())
                .description(sr.getDescription())
                .status(sr.getStatus())
                .priority(sr.getPriority())
                .locationAddress(sr.getLocationAddress())
                .convertedWorkOrderId(sr.getConvertedWorkOrder() != null ? sr.getConvertedWorkOrder().getId() : null)
                .convertedWorkOrderNumber(sr.getConvertedWorkOrder() != null ? sr.getConvertedWorkOrder().getWorkOrderNumber() : null)
                .createdAt(sr.getCreatedAt())
                .updatedAt(sr.getUpdatedAt())
                .build();
    }
}