import { Router } from 'express';

const router = Router();

// POST /auth/logout
router.post('/logout', (req, res) => {
  // In production, invalidate JWT token or session
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;

