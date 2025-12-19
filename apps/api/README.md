# PayAgent API Server (EVM)

> Express + TypeScript API server for PayAgent Gateway (EVM version)

## Overview

This API server provides backend services for the PayAgent Gateway web application, handling:
- Payment session management
- Quote generation
- Payment settlement
- Merchant configuration
- Dashboard analytics
- Authentication

## Quick Start

```bash
cd apps/api
npm install
cp env.template .env
# Edit .env with your configuration
npm run dev
```

Default port: `4000` (configurable via `API_PORT`)

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Payments
- `POST /api/payments/quote` - Create payment quote
- `POST /api/payments/session` - Create payment session
- `POST /api/payments/settle` - Settle payment
- `GET /api/payments/:sessionId/status` - Get payment status
- `POST /api/payments/:sessionId/commission/retry` - Retry commission transfer

### Merchant (requires authentication)
- `GET /me/merchant` - Get merchant information
- `POST /me/merchant/webhook` - Update webhook URL
- `POST /me/merchant/settings` - Update merchant settings

### Dashboard (requires authentication)
- `GET /me/dashboard/overview` - Get dashboard overview
- `GET /me/dashboard/analytics` - Get analytics data
- `GET /me/dashboard/revenue-series` - Get revenue time series

### Payments List (requires authentication)
- `GET /me/payments` - List payments with filters

### Authentication
- `POST /auth/logout` - Logout user

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `API_PORT` | HTTP server port | 4000 |
| `NODE_ENV` | Environment (development/production/test) | development |
| `FACILITATOR_URL` | x402 Facilitator URL | https://facilitator.payai.network |
| `MERCHANT_EVM_ADDRESS` | Merchant EVM address | - |
| `EVM_NETWORK` | EVM network (base-sepolia/base/polygon) | base-sepolia |
| `EVM_RPC_URL` | EVM RPC endpoint | - |
| `COMMISSION_BPS` | Commission basis points | 500 |
| `REQUEST_TIMEOUT_MS` | Request timeout (ms) | 30000 |
| `DATABASE_URL` | Database connection string (optional) | - |
| `JWT_SECRET` | JWT secret for authentication (optional) | - |

## Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Architecture

- **Storage**: Currently uses **in-memory storage** (Map data structures) for all data persistence
  - Payment sessions, quotes, and merchant data are stored in memory
  - **Data will be lost on server restart**
  - Suitable for development and testing only
- **Production ready**: Designed to be easily migrated to database (PostgreSQL/MongoDB)
- **Type-safe**: Full TypeScript with Zod validation
- **EVM-focused**: Built for EVM networks (Base, Polygon, etc.)

### Storage Implementation

The current implementation uses in-memory storage:
- Payment quotes: `Map<string, PaymentQuote>`
- Payment sessions: `Map<string, PaymentSession>`
- Payments: `Map<string, Payment>`
- Merchant info: In-memory object

**Important**: For production use, you must implement database persistence. The code structure is designed to make this migration straightforward.

## Next Steps

- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] Implement JWT authentication
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Integrate with Facilitator API
- [ ] Add webhook delivery system
- [ ] Add payment analytics aggregation

