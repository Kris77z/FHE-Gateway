/**
 * API Routes
 * Defines protected and public routes
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint (public)
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'x402-server-evm',
  });
});

/**
 * Premium content endpoint (protected by x402 middleware)
 * This route requires payment via x402 protocol
 */
router.get('/api/premium', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to premium content!',
    data: {
      content: 'This is premium content that requires payment.',
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * Data endpoint (protected by x402 middleware)
 * This route requires payment via x402 protocol
 */
router.get('/api/data', (_req: Request, res: Response) => {
  res.json({
    message: 'Data endpoint accessed successfully',
    data: {
      items: [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 },
      ],
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;



