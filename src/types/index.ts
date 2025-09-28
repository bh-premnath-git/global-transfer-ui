// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  wallet?: WalletSummary;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Currency types
export interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

// Transfer types
export type TransferMethod = 'bank' | 'card' | 'cash';

export interface Transfer {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  exchangeRate: number;
  fee: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transferMethod: TransferMethod;
  recipientId: string;
  recipientDetails?: TransferRecipient;
  createdAt: string;
  updatedAt: string;
}

export interface TransferRequest {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  recipientId: string;
  recipientDetails?: TransferRecipient;
  transferMethod: TransferMethod;
  fee: number;
  totalAmount: number;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  fee: number;
  timestamp: string;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  country: string;
  bankAccount?: string;
  mobileWallet?: string;
}

// Transfer state
export interface TransferState {
  transfers: Transfer[];
  currentTransfer: Transfer | null;
  exchangeRates: Record<string, ExchangeRate>;
  recipients: Recipient[];
  loading: boolean;
  error: string | null;
}

export interface WalletSummary {
  balance: number;
  currency: string;
  pending: number;
  ledgerBalance: number;
  lastUpdated: string;
}

export interface LedgerEntry {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  createdAt: string;
}

export interface TransferRecipient {
  name: string;
  email: string;
  accountNumber: string;
  country: string;
  bankName?: string;
}

export interface AccountState {
  wallet: WalletSummary | null;
  ledger: LedgerEntry[];
  loading: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}