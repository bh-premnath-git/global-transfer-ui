import { restClient } from './api/restClient';
import { graphqlClient } from './api/graphqlClient';
import { gql } from '@apollo/client';
import { API_ENDPOINTS, GRAPHQL_OPERATIONS } from '@/constants';
import { Transfer, TransferRequest, ExchangeRate, Recipient, ApiResponse } from '@/types';

class TransferService {
  async getTransfers(): Promise<ApiResponse<Transfer[]>> {
    return restClient.get(API_ENDPOINTS.TRANSFERS.LIST);
  }

  async createTransfer(transferData: TransferRequest): Promise<ApiResponse<Transfer>> {
    return restClient.post(API_ENDPOINTS.TRANSFERS.CREATE, transferData);
  }

  async getTransfer(id: string): Promise<ApiResponse<Transfer>> {
    return restClient.get(API_ENDPOINTS.TRANSFERS.GET(id));
  }

  async getExchangeRate(from: string, to: string): Promise<ApiResponse<ExchangeRate>> {
    return restClient.get(`${API_ENDPOINTS.TRANSFERS.RATES}?from=${from}&to=${to}`);
  }

  // GraphQL method for exchange rates
  async getExchangeRateGraphQL(from: string, to: string): Promise<ExchangeRate> {
    const { data } = await graphqlClient.query<{ exchangeRates: ExchangeRate }>({
      query: gql(GRAPHQL_OPERATIONS.GET_EXCHANGE_RATES),
      variables: { from, to },
    });
    return data.exchangeRates;
  }

  // GraphQL method for creating transfer
  async createTransferGraphQL(transferData: TransferRequest): Promise<Transfer> {
    const { data } = await graphqlClient.mutate<{ createTransfer: Transfer }>({
      mutation: gql(GRAPHQL_OPERATIONS.CREATE_TRANSFER),
      variables: { input: transferData },
    });
    return data.createTransfer;
  }

  async getRecipients(): Promise<ApiResponse<Recipient[]>> {
    return restClient.get(API_ENDPOINTS.RECIPIENTS.LIST);
  }

  async createRecipient(recipientData: Omit<Recipient, 'id'>): Promise<ApiResponse<Recipient>> {
    return restClient.post(API_ENDPOINTS.RECIPIENTS.CREATE, recipientData);
  }

  async updateRecipient(id: string, recipientData: Partial<Recipient>): Promise<ApiResponse<Recipient>> {
    return restClient.put(API_ENDPOINTS.RECIPIENTS.UPDATE(id), recipientData);
  }

  async deleteRecipient(id: string): Promise<ApiResponse<null>> {
    return restClient.delete(API_ENDPOINTS.RECIPIENTS.DELETE(id));
  }
}

export const transferService = new TransferService();