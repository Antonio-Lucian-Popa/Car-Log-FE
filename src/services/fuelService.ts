import { FuelLog } from '@/types';
import { apiClient } from './apiClient';

interface CreateFuelLogData {
  carId: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  price: number;
  station?: string;
  fuelType: string;
  notes?: string;
}

class FuelService {
  async getFuelLogs(carId?: string): Promise<FuelLog[]> {
    const url = carId ? `/fuel?carId=${carId}` : '/fuel';
    const response = await apiClient.get<FuelLog[]>(url);
    return response;
  }

  async getAllFuelLogs(): Promise<FuelLog[]> {
    const response = await apiClient.get<FuelLog[]>('/fuel');
    return response;
  }

  async createFuelLog(data: CreateFuelLogData): Promise<FuelLog> {
    console.log('Creating fuel log with data:', data);
    const fuelLogData = {
      carId: data.carId,
      date: data.date,
      odometer: data.odometer,
      liters: data.liters,
      price: data.price,
      station: data.station,
      fuelType: data.fuelType,
      notes: data.notes,
    };
    
    const response = await apiClient.post<FuelLog>('/fuel', fuelLogData);
    return response;
  }

  async updateFuelLog(id: string, data: Partial<CreateFuelLogData>): Promise<FuelLog> {
    const fuelLogData = {
      ...data,
      price: data.price,
    };
    
    const response = await apiClient.put<FuelLog>(`/fuel/${id}`, fuelLogData);
    return response;
  }

  async deleteFuelLog(id: string): Promise<void> {
    await apiClient.delete(`/fuel/${id}`);
  }
}

export const fuelService = new FuelService();