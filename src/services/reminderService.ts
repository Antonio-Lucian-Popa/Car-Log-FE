import { Reminder } from '@/types';
import { apiClient } from './apiClient';

class ReminderService {
  async getReminders(carId: string): Promise<Reminder[]> {
    const response = await apiClient.get<Reminder[]>(`/reminders/${carId}`);
    return response;
  }

  async createReminder(carId: string, reminderData: Omit<Reminder, 'id' | 'carId'>): Promise<Reminder> {
    const response = await apiClient.post<Reminder>(`/reminders/${carId}`, reminderData);
    return response;
  }

  async updateReminder(id: string, reminderData: Partial<Reminder>): Promise<Reminder> {
    const response = await apiClient.put<Reminder>(`/reminders/${id}`, reminderData);
    return response;
  }

  async deleteReminder(id: string): Promise<void> {
    await apiClient.delete(`/reminders/${id}`);
  }
}

export const reminderService = new ReminderService();