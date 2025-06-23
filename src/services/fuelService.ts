import { FuelLog } from '@/types';
import { apiClient } from './apiClient';

class FuelService {
  async getFuelLogs(carId: string): Promise<FuelLog[]> {
    const response = await apiClient.get<FuelLog[]>(`/fuel/${carId}`);
    return response.data;
  }

  async createFuelLog(carId: string, fuelData: Omit<FuelLog, 'id' | 'carId' | 'userId'>): Promise<FuelLog> {
    const response = await apiClient.post<FuelLog>(`/fuel/${carId}`, fuelData);
    return response.data;
  }

  async deleteFuelLog(id: string): Promise<void> {
    await apiClient.delete(`/fuel/${id}`);
  }
}

export const fuelService = new FuelService();