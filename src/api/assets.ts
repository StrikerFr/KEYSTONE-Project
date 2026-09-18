import { apiClient, PagedResponse } from './client';

export interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  model?: string;
  category?: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED' | 'SERVICE_DUE';
  customerId: string;
  customerName?: string;
  installationDate?: string;
  warrantyExpiryDate?: string;
  lastServiceDate?: string;
  nextServiceDueDate?: string;
  locationAddress?: string;
  createdAt: string;
}

export const assetApi = {
  getAssets(page = 0, size = 50): Promise<PagedResponse<Asset>> {
    return apiClient.get<PagedResponse<Asset>>(`/assets?page=${page}&size=${size}`);
  },

  getAssetById(id: string): Promise<Asset> {
    return apiClient.get<Asset>(`/assets/${id}`);
  },

  createAsset(payload: Omit<Asset, 'id' | 'createdAt' | 'customerName'>): Promise<Asset> {
    return apiClient.post<Asset>('/assets', payload);
  },
};
