import { Router } from 'express';

const router = Router();

// GET /me - Get current user information
router.get('/', (req, res) => {
  // Mock user data (replace with authentication middleware in production)
  res.json({
    success: true,
    data: {
      email: 'merchant@example.com',
      name: 'Merchant User',
      role: 'merchant',
    },
  });
});

export default router;

