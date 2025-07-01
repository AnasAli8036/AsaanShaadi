import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get user bookings
router.get('/', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Bookings endpoint - coming soon',
  });
});

// Create booking
router.post('/', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Create booking endpoint - coming soon',
  });
});

export default router;
