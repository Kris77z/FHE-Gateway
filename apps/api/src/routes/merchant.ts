import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Mock merchant data (replace with database in production)
let merchantInfo: any = {
  apiKey: process.env.MERCHANT_API_KEY || null,
  webhookUrl: '',
  webhookSecret: process.env.WEBHOOK_SECRET || null,
  defaultNetwork: 'base-sepolia',
  defaultCurrency: 'USDC',
  defaultPaymentMode: 'fhe',
  autoSettle: true,
};

// GET /me/merchant
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: merchantInfo,
  });
});

// POST /me/merchant/webhook
router.post('/webhook', (req, res) => {
  const schema = z.object({
    webhookUrl: z.string().url(),
  });

  const parse = schema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid webhook URL',
      },
    });
    return;
  }

  merchantInfo.webhookUrl = parse.data.webhookUrl;
  
  res.json({
    success: true,
    data: merchantInfo,
  });
});

// POST /me/merchant/settings
router.post('/settings', (req, res) => {
  const schema = z.object({
    defaultNetwork: z.enum(['base-sepolia', 'base', 'polygon']).optional(),
    defaultCurrency: z.enum(['USDC', 'USDT']).optional(),
    defaultPaymentMode: z.enum(['fhe', 'x402', 'both']).optional(),
    autoSettle: z.boolean().optional(),
  });

  const parse = schema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid settings payload',
      },
    });
    return;
  }

  merchantInfo = {
    ...merchantInfo,
    ...parse.data,
  };

  res.json({
    success: true,
    data: merchantInfo,
  });
});

export default router;

