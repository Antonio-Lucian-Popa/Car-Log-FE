import { RepairLog } from '@/types';
import { apiClient } from './apiClient';

interface CreateRepairLogData {
  carId: string;
  date: string;
  description: string;
  cost: number;
  service?: string;
}

class RepairService {
  async getRepairs(carId?: string): Promise<RepairLog[]> {
    const url = carId ? `/repairs?carId=${carId}` : '/repair';
    const response = await apiClient.get<RepairLog[]>(url);
    return response;
  }

  async getAllRepairs(): Promise<RepairLog[]> {
    const response = await apiClient.get<RepairLog[]>('/repair/all');
    return response;
  }

  async createRepair(data: CreateRepairLogData): Promise<RepairLog> {
    const response = await apiClient.post<RepairLog>('/repair', data);
    return response;
  }

  async updateRepair(id: string, data: Partial<CreateRepairLogData>): Promise<RepairLog> {
    const response = await apiClient.put<RepairLog>(`/repair/${id}`, data);
    return response;
  }

  async deleteRepair(id: string): Promise<void> {
    await apiClient.delete(`/repair/${id}`);
  }
}

export const repairService = new RepairService();