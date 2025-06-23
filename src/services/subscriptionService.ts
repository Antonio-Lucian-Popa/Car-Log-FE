import { apiClient } from './apiClient';

class SubscriptionService {
  async createCheckoutSession(planId: string): Promise<{ url: string }> {
    const response = await apiClient.post<{ url: string }>('/subscription/create-checkout-session', { planId });
    return response.data;
  }
}

export const subscriptionService = new SubscriptionService();