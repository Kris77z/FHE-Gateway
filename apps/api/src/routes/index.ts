import { Router } from 'express';
import paymentsRouter from './payments.js';
import paymentsListRouter from './payments-list.js';
import merchantRouter from './merchant.js';
import dashboardRouter from './dashboard.js';
import authRouter from './auth.js';
import userRouter from './user.js';

const router = Router();

// API routes
router.use('/payments', paymentsRouter);
router.use('/auth', authRouter);

// Merchant routes (require authentication in production)
const meRouter = Router();
meRouter.use('/', userRouter); // GET /me
meRouter.use('/merchant', merchantRouter);
meRouter.use('/dashboard', dashboardRouter);
meRouter.use('/payments', paymentsListRouter);

export { meRouter };
export default router;

