export interface User {
  id: string;
  email: string;
  password?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
  cars: Car[];
  plan?: SubscriptionPlan;
  planId?: string;
}

export interface Car {
  id: string;
  userId: string;
  name: string;
  model: string;
  year: number;
  numberPlate: string;
  vin?: string;
  createdAt: string;
  fuelLogs?: FuelLog[];
  repairLogs?: RepairLog[];
  reminders?: Reminder[];
}

export interface FuelLog {
  id: string;
  carId: string;
  userId: string;
  date: string;
  odometer: number;
  liters: number;
  price: number;
  station?: string;
}

export interface RepairLog {
  id: string;
  carId: string;
  date: string;
  description: string;
  cost: number;
  service?: string;
}

export enum ReminderType {
  ITP = 'ITP',
  RCA = 'RCA',
  ULEI = 'ULEI',
  REVIZIE = 'REVIZIE'
}

export interface Reminder {
  id: string;
  carId: string;
  type: ReminderType;
  dueDate: string;
  repeatDays?: number;
  notified: boolean;
}

export enum SubscriptionType {
  FREE = 'FREE',
  PRO = 'PRO',
  FLEET = 'FLEET'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
}