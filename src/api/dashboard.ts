import { apiClient } from './client';

export interface DashboardSummary {
  totalWorkOrders: number;
  openWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  pendingServiceRequests: number;
  slaAtRisk: number;
  slaBreached: number;
  slaCompliancePercentage: number;
  activeTechnicians: number;
  lowStockItems: number;
}

export interface ActivityItem {
  id: string;
  userName: string;
  userRole: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  recentWorkOrders: any[];
  recentActivity: ActivityItem[];
  statusDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
}

export const dashboardApi = {
  getOverview(): Promise<DashboardOverview> {
    return apiClient.get<DashboardOverview>('/dashboard/summary');
  },
};
