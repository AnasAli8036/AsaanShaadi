import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get current user profile
router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'User profile endpoint - coming soon',
  });
});

// Update user profile
router.put('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Update profile endpoint - coming soon',
  });
});

export default router;
