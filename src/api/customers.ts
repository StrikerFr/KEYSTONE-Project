import { apiClient, PagedResponse } from './client';

export interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: string;
  userId?: string;
  createdAt: string;
}

export const customerApi = {
  getCustomers(page = 0, size = 50): Promise<PagedResponse<Customer>> {
    return apiClient.get<PagedResponse<Customer>>(`/customers?page=${page}&size=${size}`);
  },

  getCustomerById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`/customers/${id}`);
  },

  createCustomer(payload: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    return apiClient.post<Customer>('/customers', payload);
  },
};
