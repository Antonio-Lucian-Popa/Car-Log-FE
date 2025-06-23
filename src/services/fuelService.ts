import { FuelLog, ApiResponse } from '@/types';

const API_BASE = '/api';

class FuelService {
  async getFuelLogs(carId: string): Promise<FuelLog[]> {
    const response = await fetch(`${API_BASE}/fuel/${carId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel logs');
    }

    const data: ApiResponse<FuelLog[]> = await response.json();
    return data.data;
  }

  async createFuelLog(carId: string, fuelData: Omit<FuelLog, 'id' | 'carId' | 'userId'>): Promise<FuelLog> {
    const response = await fetch(`${API_BASE}/fuel/${carId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(fuelData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create fuel log');
    }

    const data: ApiResponse<FuelLog> = await response.json();
    return data.data;
  }

  async deleteFuelLog(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/fuel/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete fuel log');
    }
  }
}

export const fuelService = new FuelService();