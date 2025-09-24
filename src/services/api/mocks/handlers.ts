import { http, HttpResponse, graphql } from 'msw';
import { API_ENDPOINTS } from '@/constants';
import { Transfer, User, ExchangeRate, Recipient } from '@/types';

// Mock data
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: '/placeholder.svg',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
  http.post(API_ENDPOINTS.AUTH.LOGIN, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'user@example.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true,
        data: {
          user: mockUser,
          token: 'mock-jwt-token',
        },
        message: 'Login successful',
      });
    }
    
    return HttpResponse.json(
      {
        success: false,
        data: null,
        message: 'Invalid credentials',
      },
      { status: 401 }
    );
  }),

  http.post(API_ENDPOINTS.AUTH.REGISTER, async ({ request }) => {
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

  http.get(API_ENDPOINTS.AUTH.ME, () => {
    return HttpResponse.json({
      success: true,
      data: mockUser,
      message: 'User retrieved successfully',
    });
  }),

  // Transfer endpoints
  http.get(API_ENDPOINTS.TRANSFERS.LIST, () => {
    return HttpResponse.json({
      success: true,
      data: mockTransfers,
      message: 'Transfers retrieved successfully',
    });
  }),

  http.post(API_ENDPOINTS.TRANSFERS.CREATE, async ({ request }) => {
    const body = await request.json() as any;
    
    const newTransfer: Transfer = {
      id: Date.now().toString(),
      ...body,
      receiveAmount: body.sendAmount * 0.85,
      exchangeRate: 0.85,
      fee: body.sendAmount * 0.005,
      totalAmount: body.sendAmount + (body.sendAmount * 0.005),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      success: true,
      data: newTransfer,
      message: 'Transfer created successfully',
    });
  }),

  http.get(API_ENDPOINTS.TRANSFERS.RATES, ({ request }) => {
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
  http.get(API_ENDPOINTS.RECIPIENTS.LIST, () => {
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

  graphql.mutation('CreateTransfer', ({ variables }) => {
    const input = variables.input as any;
    
    return HttpResponse.json({
      data: {
        createTransfer: {
          id: Date.now().toString(),
          status: 'pending',
          sendAmount: input.sendAmount,
          receiveAmount: input.sendAmount * 0.85,
          exchangeRate: 0.85,
          fee: input.sendAmount * 0.005,
        },
      },
    });
  }),
];