import { Car, ApiResponse } from '@/types';

const API_BASE = '/api';

class CarService {
  async getCars(): Promise<Car[]> {
    const response = await fetch(`${API_BASE}/cars`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }

    const data: ApiResponse<Car[]> = await response.json();
    return data.data;
  }

  async createCar(carData: Omit<Car, 'id' | 'userId' | 'createdAt'>): Promise<Car> {
    const response = await fetch(`${API_BASE}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(carData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create car');
    }

    const data: ApiResponse<Car> = await response.json();
    return data.data;
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    const response = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(carData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update car');
    }

    const data: ApiResponse<Car> = await response.json();
    return data.data;
  }

  async deleteCar(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete car');
    }
  }
}

export const carService = new CarService();