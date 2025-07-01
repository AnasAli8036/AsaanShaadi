import { Router } from 'express';
import { body, query } from 'express-validator';
import { VenueController } from '../controllers/VenueController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '@prisma/client';

const router = Router();
const venueController = new VenueController();

// Get all venues (public)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('city').optional().trim(),
    query('area').optional().trim(),
    query('minCapacity').optional().isInt({ min: 1 }),
    query('maxCapacity').optional().isInt({ min: 1 }),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('isAirConditioned').optional().isBoolean(),
    query('amenities').optional(),
    query('sortBy').optional().isIn(['price', 'rating', 'capacity', 'name']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  validate,
  optionalAuth,
  venueController.getVenues
);

// Get venue by ID (public)
router.get('/:id', optionalAuth, venueController.getVenueById);

// Create venue (vendor/admin only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.VENDOR, UserRole.ADMIN),
  [
    body('name').trim().isLength({ min: 1 }),
    body('description').trim().isLength({ min: 10 }),
    body('address').trim().isLength({ min: 5 }),
    body('city').trim().isLength({ min: 1 }),
    body('area').trim().isLength({ min: 1 }),
    body('capacity').isInt({ min: 1 }),
    body('pricePerDay').isFloat({ min: 0 }),
    body('pricePerHour').optional().isFloat({ min: 0 }),
    body('isAirConditioned').isBoolean(),
    body('amenities').isArray(),
    body('contactPerson').trim().isLength({ min: 1 }),
    body('contactPhone').isMobilePhone('any'),
    body('contactEmail').isEmail(),
    body('latitude').optional().isFloat(),
    body('longitude').optional().isFloat(),
  ],
  validate,
  venueController.createVenue
);

// Update venue (owner/admin only)
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.VENDOR, UserRole.ADMIN),
  [
    body('name').optional().trim().isLength({ min: 1 }),
    body('description').optional().trim().isLength({ min: 10 }),
    body('address').optional().trim().isLength({ min: 5 }),
    body('city').optional().trim().isLength({ min: 1 }),
    body('area').optional().trim().isLength({ min: 1 }),
    body('capacity').optional().isInt({ min: 1 }),
    body('pricePerDay').optional().isFloat({ min: 0 }),
    body('pricePerHour').optional().isFloat({ min: 0 }),
    body('isAirConditioned').optional().isBoolean(),
    body('amenities').optional().isArray(),
    body('contactPerson').optional().trim().isLength({ min: 1 }),
    body('contactPhone').optional().isMobilePhone('any'),
    body('contactEmail').optional().isEmail(),
    body('latitude').optional().isFloat(),
    body('longitude').optional().isFloat(),
  ],
  validate,
  venueController.updateVenue
);

// Delete venue (owner/admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.VENDOR, UserRole.ADMIN),
  venueController.deleteVenue
);

// Get venue availability
router.get('/:id/availability', venueController.getVenueAvailability);

// Upload venue images
router.post(
  '/:id/images',
  authenticate,
  authorize(UserRole.VENDOR, UserRole.ADMIN),
  venueController.uploadImages
);

export default router;
