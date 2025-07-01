import { Router } from 'express';
import { body, query } from 'express-validator';
import { CatererController } from '../controllers/CatererController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '@prisma/client';

const router = Router();
const catererController = new CatererController();

// Get all caterers (public)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('serviceAreas').optional(),
    query('cuisine').optional(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('minimumOrder').optional().isInt({ min: 1 }),
    query('sortBy').optional().isIn(['price', 'rating', 'name']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  validate,
  optionalAuth,
  catererController.getCaterers
);

// Get caterer by ID (public)
router.get('/:id', optionalAuth, catererController.getCatererById);

// Create caterer (vendor/admin only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.VENDOR, UserRole.ADMIN),
  [
    body('name').trim().isLength({ min: 1 }),
    body('description').trim().isLength({ min: 10 }),
    body('pricePerPerson').isFloat({ min: 0 }),
    body('minimumOrder').isInt({ min: 1 }),
    body('contactPerson').trim().isLength({ min: 1 }),
    body('contactPhone').isMobilePhone('any'),
    body('contactEmail').isEmail(),
    body('serviceAreaIds').isArray(),
    body('cuisineIds').isArray(),
    body('specialtyIds').optional().isArray(),
  ],
  validate,
  catererController.createCaterer
);

// Update caterer (owner/admin only)
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.VENDOR, UserRole.ADMIN),
  catererController.updateCaterer
);

// Delete caterer (owner/admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.VENDOR, UserRole.ADMIN),
  catererController.deleteCaterer
);

export default router;
