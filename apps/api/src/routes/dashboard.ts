import { Router } from 'express';

const router = Router();

// Mock payment data (replace with database queries in production)
const mockPayments: any[] = [];
const mockAnalytics = {
  totalRevenue: 0,
  totalPayments: 0,
  successRate: 0,
  revenueGrowth: 0,
  paymentsGrowth: 0,
  x402Percentage: 0,
  fhePercentage: 0,
};

// GET /me/dashboard/overview
router.get('/overview', (req, res) => {
  const range = req.query.range || '30d';
  const days = range === '7d' ? 7 : 30;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  res.json({
    success: true,
    data: {
      available_now: mockAnalytics.totalRevenue,
      net_revenue: mockAnalytics.totalRevenue,
      payers_total: mockAnalytics.totalPayments,
      revenue_growth_rate: mockAnalytics.revenueGrowth,
      payers_growth_rate: mockAnalytics.paymentsGrowth,
      period: {
        from: startDate.toISOString().split('T')[0],
        to: endDate.toISOString().split('T')[0],
      },
    },
  });
});

// GET /me/dashboard/analytics
router.get('/analytics', (req, res) => {
  const range = req.query.range || '30d';
  
  res.json({
    success: true,
    data: {
      totalRevenue: mockAnalytics.totalRevenue,
      totalPayments: mockAnalytics.totalPayments,
      successRate: mockAnalytics.successRate,
      revenueGrowth: mockAnalytics.revenueGrowth,
      paymentsGrowth: mockAnalytics.paymentsGrowth,
      x402Percentage: mockAnalytics.x402Percentage,
      fhePercentage: mockAnalytics.fhePercentage,
    },
  });
});

// GET /me/dashboard/revenue-series
router.get('/revenue-series', (req, res) => {
  const days = parseInt(req.query.days as string) || 30;
  const series: any[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    series.push({
      date: date.toISOString().split('T')[0],
      value: 0,
    });
  }

  res.json({
    success: true,
    data: {
      series,
      days,
    },
  });
});

export default router;

