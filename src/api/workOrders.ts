import { apiClient, PagedResponse } from './client';

export type WorkOrderStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED';

export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  organizationId: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  customer: {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  assignedTechnician?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: string;
  };
  asset?: {
    id: string;
    name: string;
    serialNumber: string;
    model?: string;
    category?: string;
    status: string;
  };
  slaPolicy?: {
    id: string;
    name: string;
    priority: string;
    resolutionTimeMinutes: number;
  };
  slaDeadline?: string;
  slaStatus?: 'HEALTHY' | 'AT_RISK' | 'BREACHED';
  remainingSlaMinutes?: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  completedAt?: string;
  locationAddress?: string;
  locationLatitude?: number;
  locationLongitude?: number;
  resolutionNotes?: string;
  customerSignature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderParams {
  title: string;
  description?: string;
  priority: WorkOrderPriority;
  customerId: string;
  assignedTechnicianId?: string;
  assetId?: string;
  slaPolicyId?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  locationAddress?: string;
}

export const workOrderApi = {
  getWorkOrders(params?: {
    status?: WorkOrderStatus;
    priority?: WorkOrderPriority;
    technicianId?: string;
    customerId?: string;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<WorkOrder>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.technicianId) query.append('technicianId', params.technicianId);
    if (params?.customerId) query.append('customerId', params.customerId);
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());

    return apiClient.get<PagedResponse<WorkOrder>>(`/work-orders?${query.toString()}`);
  },

  getWorkOrderById(id: string): Promise<WorkOrder> {
    return apiClient.get<WorkOrder>(`/work-orders/${id}`);
  },

  createWorkOrder(payload: CreateWorkOrderParams): Promise<WorkOrder> {
    return apiClient.post<WorkOrder>('/work-orders', payload);
  },

  updateStatus(
    id: string,
    status: WorkOrderStatus,
    notes?: string,
    resolutionNotes?: string,
    customerSignature?: string
  ): Promise<WorkOrder> {
    return apiClient.patch<WorkOrder>(`/work-orders/${id}/status`, {
      status,
      notes,
      resolutionNotes,
      customerSignature,
    });
  },

  assignTechnician(id: string, technicianId: string): Promise<WorkOrder> {
    return apiClient.patch<WorkOrder>(`/work-orders/${id}/assign`, { technicianId });
  },

  getHistory(id: string): Promise<any[]> {
    return apiClient.get<any[]>(`/work-orders/${id}/history`);
  },
};
