package com.keystone.time_tracking;

import com.keystone.common.KeystoneException;
import com.keystone.security.KeystonePrincipal;
import com.keystone.technician.Technician;
import com.keystone.technician.TechnicianRepository;
import com.keystone.work_order.WorkOrder;
import com.keystone.work_order.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimeTrackingService {

    private final TimeEntryRepository timeEntryRepository;
    private final WorkOrderRepository workOrderRepository;
    private final TechnicianRepository technicianRepository;

    @Transactional
    public TimeTrackingDto.Response startTime(KeystonePrincipal principal, UUID workOrderId, TimeTrackingDto.StartRequest request) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(workOrderId, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        Technician tech = technicianRepository.findByUserId(principal.userId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Technician profile not found"));

        timeEntryRepository.findByTechnicianIdAndEndTimeIsNull(tech.getId())
                .ifPresent(active -> {
                    throw new KeystoneException(HttpStatus.BAD_REQUEST, "You already have an active timer running on work order " + active.getWorkOrder().getWorkOrderNumber());
                });

        TimeEntry entry = TimeEntry.builder()
                .workOrder(wo)
                .technician(tech)
                .startTime(LocalDateTime.now())
                .description(request != null ? request.getDescription() : null)
                .build();

        TimeEntry saved = timeEntryRepository.save(entry);
        return toResponse(saved);
    }

    @Transactional
    public TimeTrackingDto.Response stopTime(KeystonePrincipal principal, UUID timeEntryId, TimeTrackingDto.StopRequest request) {
        TimeEntry entry = timeEntryRepository.findById(timeEntryId)
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Time entry not found"));

        if (entry.getEndTime() != null) {
            throw new KeystoneException(HttpStatus.BAD_REQUEST, "Timer is already stopped");
        }

        LocalDateTime now = LocalDateTime.now();
        entry.setEndTime(now);
        long minutes = Duration.between(entry.getStartTime(), now).toMinutes();
        entry.setDurationMinutes(Math.max(1, minutes));

        if (request != null && request.getDescription() != null) {
            entry.setDescription(request.getDescription());
        }

        TimeEntry saved = timeEntryRepository.save(entry);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TimeTrackingDto.Response> getWorkOrderTimeEntries(KeystonePrincipal principal, UUID workOrderId) {
        WorkOrder wo = workOrderRepository.findByIdAndOrganizationId(workOrderId, principal.organizationId())
                .orElseThrow(() -> new KeystoneException(HttpStatus.NOT_FOUND, "Work Order not found"));

        return timeEntryRepository.findByWorkOrderId(wo.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private TimeTrackingDto.Response toResponse(TimeEntry entry) {
        return TimeTrackingDto.Response.builder()
                .id(entry.getId())
                .workOrderId(entry.getWorkOrder().getId())
                .workOrderNumber(entry.getWorkOrder().getWorkOrderNumber())
                .technicianId(entry.getTechnician().getId())
                .technicianName(entry.getTechnician().getFirstName() + " " + entry.getTechnician().getLastName())
                .startTime(entry.getStartTime())
                .endTime(entry.getEndTime())
                .durationMinutes(entry.getDurationMinutes())
                .description(entry.getDescription())
                .active(entry.getEndTime() == null)
                .build();
    }
}