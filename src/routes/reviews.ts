import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// Get reviews for venue/caterer
router.get('/', optionalAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Reviews endpoint - coming soon',
  });
});

// Create review
router.post('/', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Create review endpoint - coming soon',
  });
});

export default router;
