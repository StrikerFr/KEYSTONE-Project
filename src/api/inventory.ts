import { apiClient, PagedResponse } from './client';

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  category?: string;
  unitPrice: number;
  quantityOnHand: number;
  reorderLevel: number;
  lowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderPart {
  id: string;
  workOrderId: string;
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const inventoryApi = {
  getParts(page = 0, size = 50): Promise<PagedResponse<Part>> {
    return apiClient.get<PagedResponse<Part>>(`/inventory/parts?page=${page}&size=${size}`);
  },

  createPart(payload: {
    partNumber: string;
    name: string;
    description?: string;
    category?: string;
    unitPrice: number;
    quantityOnHand: number;
    reorderLevel: number;
  }): Promise<Part> {
    return apiClient.post<Part>('/inventory/parts', payload);
  },

  addPartToWorkOrder(workOrderId: string, partId: string, quantity: number): Promise<WorkOrderPart> {
    return apiClient.post<WorkOrderPart>(`/inventory/work-orders/${workOrderId}/parts`, { partId, quantity });
  },

  getWorkOrderParts(workOrderId: string): Promise<WorkOrderPart[]> {
    return apiClient.get<WorkOrderPart[]>(`/inventory/work-orders/${workOrderId}/parts`);
  },
};
