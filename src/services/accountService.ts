import { API_ENDPOINTS } from '@/constants';
import { restClient } from './api/restClient';
import { ApiResponse, LedgerEntry, WalletSummary } from '@/types';

class AccountService {
  async getWalletSummary(): Promise<ApiResponse<WalletSummary>> {
    return restClient.get(API_ENDPOINTS.ACCOUNTS.WALLET);
  }

  async getLedger(): Promise<ApiResponse<LedgerEntry[]>> {
    return restClient.get(API_ENDPOINTS.ACCOUNTS.LEDGER);
  }
}

export const accountService = new AccountService();
