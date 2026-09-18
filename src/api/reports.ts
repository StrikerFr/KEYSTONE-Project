import { apiClient } from './client';

export interface SummaryReport {
  totalWorkOrders: number;
  completedWorkOrders: number;
  breachedSlaWorkOrders: number;
  averageCompletionTimeHours: number;
  slaCompliancePercentage: number;
  workOrdersByPriority: Record<string, number>;
  workOrdersByStatus: Record<string, number>;
}

export const reportApi = {
  getSummaryReport(): Promise<SummaryReport> {
    return apiClient.get<SummaryReport>('/reports/summary');
  },
};
