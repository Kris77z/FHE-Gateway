import { Router } from 'express';
import { z } from 'zod';
import { getConfig } from '../config.js';

const router = Router();

// In-memory stores (replace with database in production)
const quotes = new Map<string, any>();
const sessions = new Map<string, any>();
const payments = new Map<string, any>();

const createQuoteSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['USDC']),
});

const createSessionSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['USDC']),
  memo: z.string().max(120).optional(),
  quoteId: z.string().min(1),
});

const settleSchema = z.object({
  sessionId: z.string().min(1),
  paymentRequest: z.union([z.string(), z.record(z.any())]),
});

// POST /api/payments/quote
router.post('/quote', (req, res) => {
  const parse = createQuoteSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid quote payload',
        details: parse.error.flatten(),
      },
    });
    return;
  }

  try {
    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const quote = {
      id: quoteId,
      currency: parse.data.currency,
      inputAmount: parse.data.amount,
      quotedAmountUsd: parse.data.amount, // 1:1 for USDC
      rate: 1.0,
      rateSource: 'manual' as const,
      feedId: null,
      slot: null,
      fetchedAt: new Date().toISOString(),
      quoteExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };

    quotes.set(quoteId, quote);

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'QUOTE_CREATION_FAILED',
        message: error instanceof Error ? error.message : 'Failed to create quote',
      },
    });
  }
});

// POST /api/payments/session
router.post('/session', (req, res) => {
  const parse = createSessionSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid session payload',
        details: parse.error.flatten(),
      },
    });
    return;
  }

  const config = getConfig();
  const quote = quotes.get(parse.data.quoteId);

  if (!quote) {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'QUOTE_NOT_FOUND',
        message: `Quote ${parse.data.quoteId} not found`,
      },
    });
    return;
  }

  if (new Date(quote.quoteExpiresAt).getTime() <= Date.now()) {
    res.status(409).json({
      success: false,
      data: null,
      error: {
        code: 'QUOTE_EXPIRED',
        message: `Quote ${parse.data.quoteId} has expired`,
      },
    });
    return;
  }

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const nonce = Math.random().toString(36).substr(2, 9);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const session = {
    id: sessionId,
    facilitatorUrl: config.FACILITATOR_URL,
    merchantAddress: config.MERCHANT_EVM_ADDRESS || '0x0000000000000000000000000000000000000000',
    nonce,
    expiresAt,
    quote,
    amount: parse.data.amount,
    currency: parse.data.currency,
    memo: parse.data.memo,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  sessions.set(sessionId, session);

  res.json({
    success: true,
    data: {
      sessionId: session.id,
      facilitatorUrl: session.facilitatorUrl,
      merchantAddress: session.merchantAddress,
      nonce: session.nonce,
      expiresAt: session.expiresAt,
      quote: session.quote,
    },
  });
});

// POST /api/payments/settle
router.post('/settle', async (req, res) => {
  const parse = settleSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid settlement payload',
        details: parse.error.flatten(),
      },
    });
    return;
  }

  const session = sessions.get(parse.data.sessionId);
  if (!session) {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'SESSION_NOT_FOUND',
        message: `Session ${parse.data.sessionId} not found`,
      },
    });
    return;
  }

  // In a real implementation, verify the payment request with Facilitator
  // For now, we'll simulate a successful settlement
  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
  
  session.status = 'settled';
  session.transactionHash = transactionHash;
  session.settledAt = new Date().toISOString();

  const payment = {
    id: `payment_${Date.now()}`,
    sessionId: session.id,
    transactionHash,
    amount: session.amount,
    currency: session.currency,
    status: 'settled',
    createdAt: session.createdAt,
    settledAt: session.settledAt,
  };

  payments.set(payment.id, payment);

  res.json({
    success: true,
    data: {
      status: 'settled',
      transactionSignature: transactionHash,
    },
  });
});

// GET /api/payments/:sessionId/status
router.get('/:sessionId/status', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'SESSION_NOT_FOUND',
        message: `Session ${req.params.sessionId} not found`,
      },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      status: session.status,
      updatedAt: session.settledAt || session.createdAt,
      expiresAt: session.expiresAt,
      transactionSignature: session.transactionHash || null,
      failureReason: session.status === 'failed' ? session.failureReason : null,
      quote: session.quote,
      paymentRequest: null,
      settlement: session.transactionHash ? {
        settledAt: session.settledAt,
        transactionSignature: session.transactionHash,
        totalAmount: session.amount,
        commissionBps: 500,
        commissionAmount: (session.amount * 500) / 10000,
        netAmount: session.amount - (session.amount * 500) / 10000,
      } : null,
      auditLog: [],
    },
  });
});

// POST /api/payments/:sessionId/commission/retry
router.post('/:sessionId/commission/retry', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'SESSION_NOT_FOUND',
        message: `Session ${req.params.sessionId} not found`,
      },
    });
    return;
  }

  // In a real implementation, retry commission transfer
  res.json({
    success: true,
    data: {
      status: session.status,
      updatedAt: new Date().toISOString(),
      expiresAt: session.expiresAt,
      transactionSignature: session.transactionHash || null,
    },
  });
});

export default router;

