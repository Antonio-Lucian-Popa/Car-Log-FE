import { RepairLog } from '@/types';
import { apiClient } from './apiClient';

class RepairService {
  async getRepairs(carId: string): Promise<RepairLog[]> {
    const response = await apiClient.get<RepairLog[]>(`/repair/${carId}`);
    return response.data;
  }

  async createRepair(carId: string, repairData: Omit<RepairLog, 'id' | 'carId'>): Promise<RepairLog> {
    const response = await apiClient.post<RepairLog>(`/repair/${carId}`, repairData);
    return response.data;
  }

  async deleteRepair(id: string): Promise<void> {
    await apiClient.delete(`/repair/${id}`);
  }
}

export const repairService = new RepairService();