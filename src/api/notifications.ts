import { apiClient } from './client';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  entityType?: string;
  entityId?: string;
  read: boolean;
  createdAt: string;
}

export const notificationApi = {
  getNotifications(): Promise<NotificationItem[]> {
    return apiClient.get<NotificationItem[]>('/notifications');
  },

  getUnreadCount(): Promise<{ unreadCount: number }> {
    return apiClient.get<{ unreadCount: number }>('/notifications/unread-count');
  },

  markAsRead(id: string): Promise<void> {
    return apiClient.patch<void>(`/notifications/${id}/read`);
  },

  markAllAsRead(): Promise<void> {
    return apiClient.patch<void>('/notifications/read-all');
  },
};
