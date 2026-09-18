import { apiClient, PagedResponse } from './client';
import { WorkOrderPriority } from './workOrders';

export type ServiceRequestStatus = 'PENDING' | 'APPROVED' | 'CONVERTED' | 'REJECTED';

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  customer: {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
  };
  title: string;
  description: string;
  status: ServiceRequestStatus;
  priority: WorkOrderPriority;
  locationAddress?: string;
  convertedWorkOrderId?: string;
  convertedWorkOrderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export const serviceRequestApi = {
  getRequests(page = 0, size = 20): Promise<PagedResponse<ServiceRequest>> {
    return apiClient.get<PagedResponse<ServiceRequest>>(`/service-requests?page=${page}&size=${size}`);
  },

  createRequest(payload: {
    title: string;
    description: string;
    priority?: WorkOrderPriority;
    customerId?: string;
    locationAddress?: string;
  }): Promise<ServiceRequest> {
    return apiClient.post<ServiceRequest>('/service-requests', payload);
  },

  convertToWorkOrder(id: string): Promise<any> {
    return apiClient.post<any>(`/service-requests/${id}/convert`);
  },
};
