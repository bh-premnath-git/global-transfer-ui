# WSO2 Payment Platform API Integration

This document describes the integration between the Global Transfer UI and the WSO2 Payment Platform microservices.

## Architecture Overview

The application now connects to a microservices architecture with the following services:

```
┌─────────────────────────────────────────────────────────────┐
│                    Global Transfer UI                       │
│                    (React Frontend)                         │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ WSO2 Identity│   │ Forex Service│   │Payment Service│
│   (Port 9444)│   │  (Port 8001) │   │  (Port 8003) │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│Ledger Service│   │Wallet Service│   │Profile Service│
│ (Port 8002)  │   │ (Port 8006)  │   │ (Port 8004)  │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Services

### 1. WSO2 Identity Server (Port 9444)
**Purpose**: User authentication and authorization

**Endpoints**:
- `POST /oauth2/token` - Get access token (login)
- `GET /oauth2/userinfo` - Get user information
- `POST /oauth2/revoke` - Revoke token (logout)
- `POST /scim2/Users` - Register new user
- `GET /scim2/Users/{id}` - Get user details
- `PATCH /scim2/Users/{id}` - Update user (e.g., activate)

**Authentication**: 
- OAuth2 Resource Owner Password Credentials Grant
- Basic Auth with client credentials for SCIM operations

**Service File**: `src/services/wso2AuthService.ts`

### 2. Forex Service (Port 8001)
**Purpose**: Currency exchange rate management

**Endpoints**:
- `GET /health` - Health check
- `GET /rates/{from}/{to}` - Get exchange rate (e.g., /rates/USD/INR)
- `PUT /rates/{currencyPair}` - Update rate (admin only)

**Authentication**: Bearer token (OAuth2 access token)

**Service File**: `src/services/forexService.ts`

### 3. Ledger Service (Port 8002)
**Purpose**: Transaction ledger and accounting

**Endpoints**:
- `GET /health` - Health check
- `GET /ledger` - Get ledger entries
- `GET /ledger/{id}` - Get specific ledger entry

**Authentication**: Bearer token

**Service File**: `src/services/ledgerService.ts`

### 4. Payment Service (Port 8003)
**Purpose**: Payment transaction processing

**Endpoints**:
- `GET /health` - Health check
- `POST /payments` - Create payment
- `GET /payments` - List payments
- `GET /payments/{id}` - Get payment details

**Request Body** (Create Payment):
```json
{
  "amount": 1000.00,
  "currency": "INR",
  "from_account": "ACC001",
  "to_account": "ACC002",
  "description": "Test payment"
}
```

**Authentication**: Bearer token

**Service File**: `src/services/paymentService.ts`

### 5. Profile Service (Port 8004)
**Purpose**: User profile management

**Endpoints**:
- `GET /health` - Health check
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

**Authentication**: Bearer token

**Service File**: `src/services/profileService.ts`

### 6. Rule Engine Service (Port 8005)
**Purpose**: Business rules and validation

**Endpoints**:
- `GET /health` - Health check

**Service File**: Not yet implemented (health check only)

### 7. Wallet Service (Port 8006)
**Purpose**: User wallet and balance management

**Endpoints**:
- `GET /health` - Health check
- `GET /wallet` - Get wallet details
- `GET /wallet/balance` - Get wallet balance

**Authentication**: Bearer token

**Service File**: `src/services/walletService.ts`

## Environment Variables

Configure these in `.env`:

```bash
# WSO2 Identity Server
VITE_WSO2_CLIENT_ID=2TUm51v9tU94ayaV0MRvDNLCutMa
VITE_WSO2_CLIENT_SECRET=NV4V48dBpwSNQDAETnvWFoDc80UBuOvNjzRjCQD2dYIa
VITE_WSO2_BASE_URL=https://localhost:9444
VITE_WSO2_TOKEN_URL=https://localhost:9444/oauth2/token
VITE_WSO2_USERINFO_URL=https://localhost:9444/oauth2/userinfo
VITE_WSO2_SCIM_URL=https://localhost:9444/scim2

# Microservices
VITE_FOREX_SERVICE_URL=http://localhost:8001
VITE_LEDGER_SERVICE_URL=http://localhost:8002
VITE_PAYMENT_SERVICE_URL=http://localhost:8003
VITE_PROFILE_SERVICE_URL=http://localhost:8004
VITE_RULE_ENGINE_URL=http://localhost:8005
VITE_WALLET_SERVICE_URL=http://localhost:8006
```

## Authentication Flow

### Login Process
1. User enters email/password
2. Frontend calls `wso2AuthService.login()`
3. Service sends OAuth2 password grant request to `/oauth2/token`
4. WSO2 returns `access_token` and `refresh_token`
5. Service fetches user info from `/oauth2/userinfo`
6. Tokens stored in localStorage
7. Access token used for subsequent API calls

### Registration Process
1. User enters registration details
2. Frontend calls `wso2AuthService.register()`
3. Service creates user via SCIM2 API (`POST /scim2/Users`)
4. After successful creation, automatic login is performed
5. User receives access token

### Token Refresh
- When access token expires, refresh token is used
- Call `POST /oauth2/token` with `grant_type=refresh_token`
- New access token returned and stored

## API Response Format

All microservices return responses in this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
```

## Usage Examples

### Get Exchange Rate
```typescript
import { forexService } from '@/services';

const rate = await forexService.getRate('USD', 'INR');
console.log(rate.data); // { from: 'USD', to: 'INR', rate: 83.5, ... }
```

### Create Payment
```typescript
import { paymentService } from '@/services';

const payment = await paymentService.createPayment({
  amount: 1000,
  currency: 'INR',
  from_account: 'ACC001',
  to_account: 'ACC002',
  description: 'Transfer to savings'
});
```

### Get Wallet Balance
```typescript
import { walletService } from '@/services';

const wallet = await walletService.getWallet();
console.log(wallet.data.balance);
```

## Migration Notes

### Changes from Mock Implementation
1. **No MSW**: All mock service worker code removed
2. **Real OAuth2**: Using WSO2 Identity Server for authentication
3. **Microservices**: Separated concerns across multiple services
4. **Bearer Tokens**: All API calls require OAuth2 access token
5. **HTTPS for WSO2**: Identity server uses HTTPS with self-signed cert

### Breaking Changes
- Authentication now requires valid WSO2 credentials
- API endpoints changed to microservice URLs
- Response formats may differ from mocks
- CORS and SSL certificate handling may be needed in development

## Troubleshooting

### Common Issues

**1. SSL Certificate Errors (WSO2)**
- WSO2 uses self-signed certificate
- In development, you may need to accept the certificate
- Visit `https://localhost:9444` in browser and accept

**2. CORS Errors**
- Ensure microservices have CORS enabled
- Check allowed origins include `http://localhost:5173`

**3. Authentication Failures**
- Verify client_id and client_secret are correct
- Check user credentials are valid in WSO2
- Ensure user is activated (SCIM2 user status)

**4. Service Unavailable**
- Check all microservices are running on correct ports
- Use health check endpoints to verify
- Check network connectivity

## Testing

### Health Checks
All services provide health check endpoints:
```bash
curl http://localhost:8001/health  # Forex
curl http://localhost:8002/health  # Ledger
curl http://localhost:8003/health  # Payment
curl http://localhost:8004/health  # Profile
curl http://localhost:8005/health  # Rule Engine
curl http://localhost:8006/health  # Wallet
```

### Postman Collection
Import `WSO2_Payment_Platform.postman_collection.json` for complete API testing.

## Security Considerations

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **HTTPS**: Use HTTPS in production for all services
3. **Token Expiry**: Implement automatic token refresh
4. **CORS**: Configure restrictive CORS policies
5. **Secrets**: Never commit `.env` file with real credentials
