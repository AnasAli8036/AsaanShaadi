import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';

const router = Router();
const authController = new AuthController();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().isLength({ min: 1 }),
    body('lastName').trim().isLength({ min: 1 }),
    body('phone').isMobilePhone('any'),
  ],
  validate,
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
  ],
  validate,
  authController.login
);

// Verify email
router.post('/verify-email', authController.verifyEmail);

// Forgot password
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validate,
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').exists(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  authController.resetPassword
);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

export default router;
