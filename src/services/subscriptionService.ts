import { ApiResponse } from '@/types';

const API_BASE = '/api';

class SubscriptionService {
  async createCheckoutSession(planId: string): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE}/subscription/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const data: ApiResponse<{ url: string }> = await response.json();
    return data.data;
  }
}

export const subscriptionService = new SubscriptionService();