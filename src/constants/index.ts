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

// Microservice base URLs
export const SERVICES = {
  WSO2: import.meta.env.VITE_WSO2_BASE_URL || 'https://localhost:9444',
  FOREX: import.meta.env.VITE_FOREX_SERVICE_URL || 'http://localhost:8001',
  LEDGER: import.meta.env.VITE_LEDGER_SERVICE_URL || 'http://localhost:8002',
  PAYMENT: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8003',
  PROFILE: import.meta.env.VITE_PROFILE_SERVICE_URL || 'http://localhost:8004',
  RULE_ENGINE: import.meta.env.VITE_RULE_ENGINE_URL || 'http://localhost:8005',
  WALLET: import.meta.env.VITE_WALLET_SERVICE_URL || 'http://localhost:8006',
};

export const API_ENDPOINTS = {
  // WSO2 Identity Server - User Management (SCIM2)
  AUTH: {
    TOKEN: `${SERVICES.WSO2}/oauth2/token`,
    USERINFO: `${SERVICES.WSO2}/oauth2/userinfo`,
    REVOKE: `${SERVICES.WSO2}/oauth2/revoke`,
    SCIM_USERS: `${SERVICES.WSO2}/scim2/Users`,
    SCIM_USER: (id: string) => `${SERVICES.WSO2}/scim2/Users/${id}`,
  },
  // Forex Service (Port 8001)
  FOREX: {
    HEALTH: `${SERVICES.FOREX}/health`,
    RATE: (from: string, to: string) => `${SERVICES.FOREX}/rates/${from}/${to}`,
    UPDATE_RATE: (currencyPair: string) => `${SERVICES.FOREX}/rates/${currencyPair}`,
  },
  // Ledger Service (Port 8002)
  LEDGER: {
    HEALTH: `${SERVICES.LEDGER}/health`,
    LIST: `${SERVICES.LEDGER}/ledger`,
    ENTRY: (id: string) => `${SERVICES.LEDGER}/ledger/${id}`,
  },
  // Payment Service (Port 8003)
  PAYMENT: {
    HEALTH: `${SERVICES.PAYMENT}/health`,
    CREATE: `${SERVICES.PAYMENT}/payments`,
    LIST: `${SERVICES.PAYMENT}/payments`,
    GET: (id: string) => `${SERVICES.PAYMENT}/payments/${id}`,
  },
  // Profile Service (Port 8004)
  PROFILE: {
    HEALTH: `${SERVICES.PROFILE}/health`,
    GET: `${SERVICES.PROFILE}/profile`,
    UPDATE: `${SERVICES.PROFILE}/profile`,
  },
  // Rule Engine Service (Port 8005)
  RULE_ENGINE: {
    HEALTH: `${SERVICES.RULE_ENGINE}/health`,
  },
  // Wallet Service (Port 8006)
  WALLET: {
    HEALTH: `${SERVICES.WALLET}/health`,
    GET: `${SERVICES.WALLET}/wallet`,
    BALANCE: `${SERVICES.WALLET}/wallet/balance`,
  },
  // Legacy/Compatibility endpoints
  TRANSFERS: {
    LIST: `${SERVICES.PAYMENT}/payments`,
    CREATE: `${SERVICES.PAYMENT}/payments`,
    GET: (id: string) => `${SERVICES.PAYMENT}/payments/${id}`,
    RATES: (from: string, to: string) => `${SERVICES.FOREX}/rates/${from}/${to}`,
  },
  ACCOUNTS: {
    WALLET: `${SERVICES.WALLET}/wallet`,
    LEDGER: `${SERVICES.LEDGER}/ledger`,
  },
  RECIPIENTS: {
    LIST: `${SERVICES.PROFILE}/recipients`,
    CREATE: `${SERVICES.PROFILE}/recipients`,
    GET: (id: string) => `${SERVICES.PROFILE}/recipients/${id}`,
    UPDATE: (id: string) => `${SERVICES.PROFILE}/recipients/${id}`,
    DELETE: (id: string) => `${SERVICES.PROFILE}/recipients/${id}`,
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