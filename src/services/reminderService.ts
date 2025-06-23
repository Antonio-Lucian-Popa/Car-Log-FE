import { Reminder, ApiResponse } from '@/types';

const API_BASE = '/api';

class ReminderService {
  async getReminders(carId: string): Promise<Reminder[]> {
    const response = await fetch(`${API_BASE}/reminders/${carId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reminders');
    }

    const data: ApiResponse<Reminder[]> = await response.json();
    return data.data;
  }

  async createReminder(carId: string, reminderData: Omit<Reminder, 'id' | 'carId'>): Promise<Reminder> {
    const response = await fetch(`${API_BASE}/reminders/${carId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reminderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create reminder');
    }

    const data: ApiResponse<Reminder> = await response.json();
    return data.data;
  }

  async updateReminder(id: string, reminderData: Partial<Reminder>): Promise<Reminder> {
    const response = await fetch(`${API_BASE}/reminders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reminderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update reminder');
    }

    const data: ApiResponse<Reminder> = await response.json();
    return data.data;
  }

  async deleteReminder(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/reminders/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete reminder');
    }
  }
}

export const reminderService = new ReminderService();