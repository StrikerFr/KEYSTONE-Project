package com.keystone.work_order;

import com.keystone.common.KeystoneException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.junit.jupiter.api.Assertions.*;

class WorkOrderServiceTest {

    @Test
    @DisplayName("Valid transition from NEW to ASSIGNED should pass")
    void testValidStatusTransitionNewToAssigned() {
        assertDoesNotThrow(() ->
                WorkOrderStatusMachine.validateTransition(WorkOrderStatus.NEW, WorkOrderStatus.ASSIGNED)
        );
    }

    @Test
    @DisplayName("Valid transition from IN_PROGRESS to COMPLETED should pass")
    void testValidStatusTransitionInProgressToCompleted() {
        assertDoesNotThrow(() ->
                WorkOrderStatusMachine.validateTransition(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.COMPLETED)
        );
    }

    @Test
    @DisplayName("Invalid transition from NEW directly to COMPLETED should throw KeystoneException")
    void testInvalidStatusTransitionNewToCompleted() {
        KeystoneException ex = assertThrows(KeystoneException.class, () ->
                WorkOrderStatusMachine.validateTransition(WorkOrderStatus.NEW, WorkOrderStatus.COMPLETED)
        );
        assertTrue(ex.getMessage().contains("Invalid status transition"));
    }

    @Test
    @DisplayName("Invalid transition from CLOSED to IN_PROGRESS should throw KeystoneException")
    void testInvalidStatusTransitionClosedToInProgress() {
        KeystoneException ex = assertThrows(KeystoneException.class, () ->
                WorkOrderStatusMachine.validateTransition(WorkOrderStatus.CLOSED, WorkOrderStatus.IN_PROGRESS)
        );
        assertTrue(ex.getMessage().contains("Invalid status transition"));
    }
}