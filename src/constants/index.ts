import { Currency } from '@/types';

export const APP_NAME = "TransferPro";

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
];

export const TRANSFER_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 100000,
};

export const FEE_RATES = {
  STANDARD: 0.005, // 0.5%
  PREMIUM: 0.002,  // 0.2%
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TRANSFERS: {
    LIST: '/transfers',
    CREATE: '/transfers',
    GET: (id: string) => `/transfers/${id}`,
    RATES: '/transfers/rates',
  },
  RECIPIENTS: {
    LIST: '/recipients',
    CREATE: '/recipients',
    GET: (id: string) => `/recipients/${id}`,
    UPDATE: (id: string) => `/recipients/${id}`,
    DELETE: (id: string) => `/recipients/${id}`,
  },
};

export const GRAPHQL_OPERATIONS = {
  GET_EXCHANGE_RATES: `
    query GetExchangeRates($from: String!, $to: String!) {
      exchangeRates(from: $from, to: $to) {
        rate
        fee
        timestamp
      }
    }
  `,
  CREATE_TRANSFER: `
    mutation CreateTransfer($input: TransferInput!) {
      createTransfer(input: $input) {
        id
        status
        sendAmount
        receiveAmount
        exchangeRate
        fee
      }
    }
  `,
};