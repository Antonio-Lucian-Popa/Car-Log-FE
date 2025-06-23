import { RepairLog, ApiResponse } from '@/types';

const API_BASE = '/api';

class RepairService {
  async getRepairs(carId: string): Promise<RepairLog[]> {
    const response = await fetch(`${API_BASE}/repair/${carId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repairs');
    }

    const data: ApiResponse<RepairLog[]> = await response.json();
    return data.data;
  }

  async createRepair(carId: string, repairData: Omit<RepairLog, 'id' | 'carId'>): Promise<RepairLog> {
    const response = await fetch(`${API_BASE}/repair/${carId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(repairData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create repair');
    }

    const data: ApiResponse<RepairLog> = await response.json();
    return data.data;
  }

  async deleteRepair(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/repair/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete repair');
    }
  }
}

export const repairService = new RepairService();