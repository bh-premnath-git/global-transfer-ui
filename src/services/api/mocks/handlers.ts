import { http, HttpResponse, graphql } from 'msw';
import { API_ENDPOINTS } from '@/constants';
import { Transfer, User, ExchangeRate, Recipient, WalletSummary, LedgerEntry, TransferRequest } from '@/types';

const resolveEndpoint = (endpoint: string) => {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';
  const normalizedBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!normalizedBase) {
    return normalizedEndpoint;
  }

  return `${normalizedBase}${normalizedEndpoint}`;
};

// Mock data
const mockWallet: WalletSummary = {
  balance: 4250.75,
  currency: 'USD',
  pending: 180.5,
  ledgerBalance: 4070.25,
  lastUpdated: new Date().toISOString(),
};

const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: '/placeholder.svg',
  wallet: mockWallet,
};

const mockTransfers: Transfer[] = [
  {
    id: '1',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    sendAmount: 1000,
    receiveAmount: 850,
    exchangeRate: 0.85,
    fee: 5,
    totalAmount: 1005,
    status: 'completed',
    recipientId: '1',
    recipientDetails: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      accountNumber: 'DE89370400440532013000',
      country: 'Germany',
      bankName: 'Deutsche Bank',
    },
    deliveryMethod: 'bank',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    fromCurrency: 'GBP',
    toCurrency: 'USD',
    sendAmount: 500,
    receiveAmount: 630,
    exchangeRate: 1.26,
    fee: 2.5,
    totalAmount: 502.5,
    status: 'completed',
    recipientId: '2',
    recipientDetails: {
      name: 'Marco Rossi',
      email: 'marco@example.it',
      accountNumber: 'IT60X0542811101000000123456',
      country: 'Italy',
      bankName: 'Intesa Sanpaolo',
    },
    deliveryMethod: 'bank',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    fromCurrency: 'USD',
    toCurrency: 'INR',
    sendAmount: 250,
    receiveAmount: 20625,
    exchangeRate: 82.5,
    fee: 1.25,
    totalAmount: 251.25,
    status: 'pending',
    recipientId: '3',
    recipientDetails: {
      name: 'Aisha Khan',
      email: 'aisha@example.in',
      accountNumber: 'IN0987654321123456',
      country: 'India',
      bankName: 'HDFC Bank',
    },
    deliveryMethod: 'cash',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

let mockLedger: LedgerEntry[] = [
  {
    id: 'led-1',
    type: 'debit',
    amount: 1005,
    currency: 'USD',
    description: 'Transfer to Jane Smith',
    reference: 'TRX-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'led-2',
    type: 'credit',
    amount: 500,
    currency: 'USD',
    description: 'Salary payout',
    reference: 'PAY-88421',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

const mockRecipients: Recipient[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    country: 'Germany',
    bankAccount: 'DE89370400440532013000',
  },
];

export const handlers = [
  // Auth endpoints
  http.post(resolveEndpoint(API_ENDPOINTS.AUTH.LOGIN), async ({ request }) => {
    try {
      const body = await request.json() as { email: string; password: string };

      if (body.email === 'user@example.com' && body.password === 'password') {
        return HttpResponse.json({
          success: true,
          data: {
            user: mockUser,
            token: 'mock-jwt-token',
          },
          message: 'Login successful',
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return HttpResponse.json(
        {
          success: false,
          data: null,
          message: 'Invalid credentials',
        },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Login handler error:', error);
      return HttpResponse.json(
        {
          success: false,
          data: null,
          message: 'Server error',
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }),

  http.post(resolveEndpoint(API_ENDPOINTS.AUTH.REGISTER), async ({ request }) => {
    const body = await request.json() as { email: string; password: string; name: string };

    return HttpResponse.json({
      success: true,
      data: {
        user: { ...mockUser, email: body.email, name: body.name },
        token: 'mock-jwt-token',
      },
      message: 'Registration successful',
    });
  }),

  http.post(resolveEndpoint(API_ENDPOINTS.AUTH.LOGOUT), () => {
    return HttpResponse.json({
      success: true,
      data: null,
      message: 'Logout successful',
    });
  }),

  http.get(resolveEndpoint(API_ENDPOINTS.AUTH.ME), () => {
    return HttpResponse.json({
      success: true,
      data: { ...mockUser, wallet: mockWallet },
      message: 'User retrieved successfully',
    });
  }),

  // Account endpoints
  http.get(resolveEndpoint(API_ENDPOINTS.ACCOUNTS.WALLET), () => {
    return HttpResponse.json({
      success: true,
      data: mockWallet,
      message: 'Wallet retrieved successfully',
    });
  }),

  http.get(resolveEndpoint(API_ENDPOINTS.ACCOUNTS.LEDGER), () => {
    return HttpResponse.json({
      success: true,
      data: mockLedger,
      message: 'Ledger retrieved successfully',
    });
  }),

  // Transfer endpoints
  http.get(resolveEndpoint(API_ENDPOINTS.TRANSFERS.LIST), () => {
    return HttpResponse.json({
      success: true,
      data: mockTransfers,
      message: 'Transfers retrieved successfully',
    });
  }),

  http.post(resolveEndpoint(API_ENDPOINTS.TRANSFERS.CREATE), async ({ request }) => {
    const body = await request.json() as TransferRequest;

    const newTransfer: Transfer = {
      id: Date.now().toString(),
      ...body,
      receiveAmount: body.sendAmount * 0.85,
      exchangeRate: 0.85,
      fee: body.sendAmount * 0.005,
      totalAmount: body.sendAmount + (body.sendAmount * 0.005),
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTransfers.unshift(newTransfer);

    const debitAmount = newTransfer.totalAmount;
    mockWallet.balance = Number((mockWallet.balance - debitAmount).toFixed(2));
    mockWallet.ledgerBalance = Number((mockWallet.ledgerBalance - debitAmount).toFixed(2));
    mockWallet.pending = Number((mockWallet.pending + newTransfer.totalAmount * 0.1).toFixed(2));
    mockWallet.lastUpdated = new Date().toISOString();

    const ledgerEntry: LedgerEntry = {
      id: `led-${Date.now()}`,
      type: 'debit',
      amount: Number(debitAmount.toFixed(2)),
      currency: newTransfer.fromCurrency,
      description: `Transfer to ${newTransfer.recipientDetails?.name ?? 'recipient'}`,
      reference: `TRX-${newTransfer.id.slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    mockLedger = [ledgerEntry, ...mockLedger].slice(0, 20);

    return HttpResponse.json({
      success: true,
      data: newTransfer,
      message: 'Transfer created successfully',
    });
  }),

  http.get(resolveEndpoint(API_ENDPOINTS.TRANSFERS.RATES), ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from') || 'USD';
    const to = url.searchParams.get('to') || 'EUR';
    
    const rate: ExchangeRate = {
      from,
      to,
      rate: 0.85,
      fee: 0.005,
      timestamp: new Date().toISOString(),
    };

    return HttpResponse.json({
      success: true,
      data: rate,
      message: 'Exchange rate retrieved successfully',
    });
  }),

  // Recipients endpoints
  http.get(resolveEndpoint(API_ENDPOINTS.RECIPIENTS.LIST), () => {
    return HttpResponse.json({
      success: true,
      data: mockRecipients,
      message: 'Recipients retrieved successfully',
    });
  }),

  // GraphQL endpoints
  graphql.query('GetExchangeRates', ({ variables }) => {
    return HttpResponse.json({
      data: {
        exchangeRates: {
          rate: 0.85,
          fee: 0.005,
          timestamp: new Date().toISOString(),
        },
      },
    });
  }),

  graphql.mutation('CreateTransfer', ({ variables }: { variables: { input: TransferRequest } }) => {
    const { input } = variables;

    return HttpResponse.json({
      data: {
        createTransfer: {
          id: Date.now().toString(),
          status: 'pending',
          sendAmount: input.sendAmount,
          receiveAmount: input.sendAmount * 0.85,
          exchangeRate: 0.85,
          fee: input.sendAmount * 0.005,
          deliveryMethod: input.deliveryMethod,
        },
      },
    });
  }),
];