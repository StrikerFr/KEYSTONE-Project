package com.keystone.work_order;

import com.keystone.common.KeystoneException;
import org.springframework.http.HttpStatus;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public class WorkOrderStatusMachine {

    private static final Map<WorkOrderStatus, Set<WorkOrderStatus>> VALID_TRANSITIONS = new EnumMap<>(WorkOrderStatus.class);

    static {
        VALID_TRANSITIONS.put(WorkOrderStatus.NEW, EnumSet.of(WorkOrderStatus.ASSIGNED, WorkOrderStatus.SCHEDULED, WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED));
        VALID_TRANSITIONS.put(WorkOrderStatus.ASSIGNED, EnumSet.of(WorkOrderStatus.SCHEDULED, WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.NEW, WorkOrderStatus.CANCELLED));
        VALID_TRANSITIONS.put(WorkOrderStatus.SCHEDULED, EnumSet.of(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.ASSIGNED, WorkOrderStatus.ON_HOLD, WorkOrderStatus.CANCELLED));
        VALID_TRANSITIONS.put(WorkOrderStatus.IN_PROGRESS, EnumSet.of(WorkOrderStatus.ON_HOLD, WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED));
        VALID_TRANSITIONS.put(WorkOrderStatus.ON_HOLD, EnumSet.of(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED));
        VALID_TRANSITIONS.put(WorkOrderStatus.COMPLETED, EnumSet.of(WorkOrderStatus.CLOSED, WorkOrderStatus.IN_PROGRESS));
        VALID_TRANSITIONS.put(WorkOrderStatus.CLOSED, EnumSet.noneOf(WorkOrderStatus.class));
        VALID_TRANSITIONS.put(WorkOrderStatus.CANCELLED, EnumSet.noneOf(WorkOrderStatus.class));
    }

    public static void validateTransition(WorkOrderStatus current, WorkOrderStatus target) {
        if (current == target) {
            return;
        }
        Set<WorkOrderStatus> allowed = VALID_TRANSITIONS.get(current);
        if (allowed == null || !allowed.contains(target)) {
            throw new KeystoneException(
                    HttpStatus.BAD_REQUEST,
                    String.format("Invalid status transition from %s to %s", current, target)
            );
        }
    }
}