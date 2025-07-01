import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Admin dashboard stats
router.get(
  '/dashboard',
  authenticate,
  authorize(UserRole.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin dashboard endpoint - coming soon',
    });
  }
);

// Get all users
router.get(
  '/users',
  authenticate,
  authorize(UserRole.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin users endpoint - coming soon',
    });
  }
);

export default router;
