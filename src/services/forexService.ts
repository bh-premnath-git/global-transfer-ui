import { restClient } from './api/restClient';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse, ExchangeRate } from '@/types';

/**
 * Forex Service - Handles currency exchange rate operations
 * Connects to Forex microservice on port 8001
 */
class ForexService {
  /**
   * Get exchange rate between two currencies
   */
  async getRate(fromCurrency: string, toCurrency: string): Promise<ApiResponse<ExchangeRate>> {
    try {
      const endpoint = API_ENDPOINTS.FOREX.RATE(fromCurrency, toCurrency);
      return await restClient.get<ExchangeRate>(endpoint);
    } catch (error) {
      console.error('Forex getRate error:', error);
      throw error;
    }
  }

  /**
   * Update exchange rate manually (admin operation)
   */
  async updateRate(
    currencyPair: string, 
    rate: number, 
    note?: string
  ): Promise<ApiResponse<any>> {
    try {
      const endpoint = API_ENDPOINTS.FOREX.UPDATE_RATE(currencyPair);
      return await restClient.put(endpoint, { rate, note });
    } catch (error) {
      console.error('Forex updateRate error:', error);
      throw error;
    }
  }

  /**
   * Health check for Forex service
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      return await restClient.get(API_ENDPOINTS.FOREX.HEALTH);
    } catch (error) {
      console.error('Forex health check error:', error);
      throw error;
    }
  }
}

export const forexService = new ForexService();
