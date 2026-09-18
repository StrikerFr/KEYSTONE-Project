package com.keystone.time_tracking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, UUID> {
    List<TimeEntry> findByWorkOrderId(UUID workOrderId);
    Optional<TimeEntry> findByTechnicianIdAndEndTimeIsNull(UUID technicianId);

    @Query("SELECT SUM(t.durationMinutes) FROM TimeEntry t WHERE t.workOrder.id = :workOrderId AND t.durationMinutes IS NOT NULL")
    Long sumDurationByWorkOrderId(@Param("workOrderId") UUID workOrderId);
}