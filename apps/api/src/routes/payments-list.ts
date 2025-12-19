import { Router } from 'express';

const router = Router();

// GET /me/payments
router.get('/', (req, res) => {
  const status = req.query.status || 'confirmed';
  const search = req.query.search || '';
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const chain = req.query.chain || 'base-sepolia';

  // Mock payment data (replace with database queries in production)
  const mockPayments: any[] = [];

  res.json({
    success: true,
    data: {
      items: mockPayments,
      total: mockPayments.length,
      page,
      pageSize,
    },
  });
});

export default router;

