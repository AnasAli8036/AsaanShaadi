import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = Router();

// Submit contact form
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 1 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').isMobilePhone('any'),
    body('subject').trim().isLength({ min: 1 }),
    body('message').trim().isLength({ min: 10 }),
  ],
  validate,
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Contact form endpoint - coming soon',
    });
  }
);

export default router;
