import { Car } from '@/types';
import { apiClient } from './apiClient';

class CarService {
  async getCars(): Promise<Car[]> {
    const response = await apiClient.get<Car[]>('/cars');
    return response.data;
  }

  async createCar(carData: Omit<Car, 'id' | 'userId' | 'createdAt'>): Promise<Car> {
    const response = await apiClient.post<Car>('/cars', carData);
    return response.data;
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    const response = await apiClient.put<Car>(`/cars/${id}`, carData);
    return response.data;
  }

  async deleteCar(id: string): Promise<void> {
    await apiClient.delete(`/cars/${id}`);
  }
}

export const carService = new CarService();