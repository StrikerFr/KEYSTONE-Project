import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'CUSTOMER';
  status: string;
  phone?: string;
  avatarUrl?: string;
  organizationId: string;
  organizationName: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    apiClient.setToken(data.accessToken);
    localStorage.setItem('keystone_user', JSON.stringify(data.user));
    return data;
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  logout() {
    apiClient.clearToken();
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('keystone_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
