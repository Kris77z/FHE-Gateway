/**
 * x402 Server Entry Point
 * Express server with x402 payment middleware integration
 */

import express from 'express';
import cors from 'cors';
import { paymentMiddleware, Network } from 'x402-express';
import { config } from './config.js';
import routes from './routes.js';

const app = express();

// Middleware
app.use(cors({
  exposedHeaders: ['X-PAYMENT-RESPONSE'], // Expose X-PAYMENT-RESPONSE header to browser
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.headers['x-payment']) {
    console.log(`   X-PAYMENT header present: ${req.headers['x-payment'].substring(0, 50)}...`);
  }
  next();
});

// Add response logging middleware to track settlement headers
app.use((req, res, next) => {
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    if (res.getHeader('X-PAYMENT-RESPONSE')) {
      console.log(`✅ X-PAYMENT-RESPONSE header set: ${res.getHeader('X-PAYMENT-RESPONSE')?.toString().substring(0, 100)}...`);
    } else {
      console.log(`⚠️ X-PAYMENT-RESPONSE header NOT set for ${req.method} ${req.path}`);
    }
    originalEnd.call(this, chunk, encoding, cb);
  };
  next();
});

// Configure Facilitator
// PayAI Facilitator URL for Base Sepolia
const facilitatorConfig = {
  url: config.facilitatorUrl,
};

// Apply x402 payment middleware
// This middleware will:
// 1. Check for X-PAYMENT header
// 2. Verify payment via facilitator
// 3. Settle payment if valid
// 4. Allow request to proceed

app.use(
  paymentMiddleware(
    config.payToAddress as `0x${string}`,
    {
      'GET /api/premium': {
        price: '$0.01',
        network: config.network as Network,
        config: {
          description: 'Access to premium content',
        },
      },
      'GET /api/data': {
        price: '$0.05',
        network: config.network as Network,
        config: {
          description: 'Access to data endpoint',
        },
      },
    },
    facilitatorConfig,
  ),
);

// Routes
app.use('/', routes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`\n🚀 x402 Server started`);
  console.log(`   Listening on http://localhost:${config.port}`);
  console.log(`   Network: ${config.network}`);
  console.log(`   Pay To: ${config.payToAddress}`);
  console.log(`\n📋 Protected endpoints:`);
  console.log(`   GET /api/premium - $0.01 USDC`);
  console.log(`   GET /api/data - $0.05 USDC`);
  console.log(`\n✅ Server ready!\n`);
});

// Handle server errors
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${config.port} is already in use!`);
    console.error(`   Please either:`);
    console.error(`   1. Stop the process using port ${config.port}`);
    console.error(`   2. Change PORT in .env file to use a different port`);
    console.error(`\n   To find the process: lsof -ti:${config.port}`);
    console.error(`   To kill it: kill $(lsof -ti:${config.port})\n`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

