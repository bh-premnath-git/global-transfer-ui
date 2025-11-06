import { restClient } from './api/restClient';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse, WalletSummary } from '@/types';

/**
 * Wallet Service - Handles wallet and balance operations
 * Connects to Wallet microservice on port 8006
 */
class WalletService {
  /**
   * Get wallet details
   */
  async getWallet(): Promise<ApiResponse<WalletSummary>> {
    try {
      return await restClient.get<WalletSummary>(API_ENDPOINTS.WALLET.GET);
    } catch (error) {
      console.error('Get wallet error:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(): Promise<ApiResponse<{ balance: number; currency: string }>> {
    try {
      return await restClient.get(API_ENDPOINTS.WALLET.BALANCE);
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  /**
   * Health check for Wallet service
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      return await restClient.get(API_ENDPOINTS.WALLET.HEALTH);
    } catch (error) {
      console.error('Wallet health check error:', error);
      throw error;
    }
  }
}

export const walletService = new WalletService();
