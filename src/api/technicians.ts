import { apiClient, PagedResponse } from './client';

export interface Technician {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'AVAILABLE' | 'ON_SITE' | 'OFF_DUTY' | 'BUSY';
  skills: string[];
  currentLatitude?: number;
  currentLongitude?: number;
  userId: string;
}

export const technicianApi = {
  getTechnicians(page = 0, size = 50): Promise<PagedResponse<Technician>> {
    return apiClient.get<PagedResponse<Technician>>(`/technicians?page=${page}&size=${size}`);
  },

  getTechnicianById(id: string): Promise<Technician> {
    return apiClient.get<Technician>(`/technicians/${id}`);
  },
};
