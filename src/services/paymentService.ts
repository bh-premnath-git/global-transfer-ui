import { restClient } from './api/restClient';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse } from '@/types';

export interface PaymentRequest {
  amount: number;
  currency: string;
  from_account: string;
  to_account: string;
  description?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  from_account: string;
  to_account: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

/**
 * Payment Service - Handles payment transactions
 * Connects to Payment microservice on port 8003
 */
class PaymentService {
  /**
   * Create a new payment
   */
  async createPayment(paymentData: PaymentRequest): Promise<ApiResponse<Payment>> {
    try {
      return await restClient.post<Payment>(API_ENDPOINTS.PAYMENT.CREATE, paymentData);
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  }

  /**
   * Get list of payments
   */
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    try {
      return await restClient.get<Payment[]>(API_ENDPOINTS.PAYMENT.LIST);
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    try {
      const endpoint = API_ENDPOINTS.PAYMENT.GET(id);
      return await restClient.get<Payment>(endpoint);
    } catch (error) {
      console.error('Get payment error:', error);
      throw error;
    }
  }

  /**
   * Health check for Payment service
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      return await restClient.get(API_ENDPOINTS.PAYMENT.HEALTH);
    } catch (error) {
      console.error('Payment health check error:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
