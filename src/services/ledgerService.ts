import { restClient } from './api/restClient';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse, LedgerEntry } from '@/types';

/**
 * Ledger Service - Handles accounting ledger operations
 * Connects to Ledger microservice on port 8002
 */
class LedgerService {
  /**
   * Get ledger entries
   */
  async getLedger(): Promise<ApiResponse<LedgerEntry[]>> {
    try {
      return await restClient.get<LedgerEntry[]>(API_ENDPOINTS.LEDGER.LIST);
    } catch (error) {
      console.error('Get ledger error:', error);
      throw error;
    }
  }

  /**
   * Get specific ledger entry by ID
   */
  async getLedgerEntry(id: string): Promise<ApiResponse<LedgerEntry>> {
    try {
      const endpoint = API_ENDPOINTS.LEDGER.ENTRY(id);
      return await restClient.get<LedgerEntry>(endpoint);
    } catch (error) {
      console.error('Get ledger entry error:', error);
      throw error;
    }
  }

  /**
   * Health check for Ledger service
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      return await restClient.get(API_ENDPOINTS.LEDGER.HEALTH);
    } catch (error) {
      console.error('Ledger health check error:', error);
      throw error;
    }
  }
}

export const ledgerService = new LedgerService();
