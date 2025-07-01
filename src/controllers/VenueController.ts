import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { UserRole } from '@prisma/client';

export class VenueController {
  async getVenues(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        page = 1,
        limit = 12,
        city,
        area,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice,
        isAirConditioned,
        amenities,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build filter conditions
      const where: any = {
        isActive: true,
        isApproved: true,
      };

      if (city) {
        where.city = {
          name: { contains: city as string, mode: 'insensitive' }
        };
      }

      if (area) {
        where.area = {
          name: { contains: area as string, mode: 'insensitive' }
        };
      }

      if (minCapacity || maxCapacity) {
        where.capacity = {};
        if (minCapacity) where.capacity.gte = Number(minCapacity);
        if (maxCapacity) where.capacity.lte = Number(maxCapacity);
      }

      if (minPrice || maxPrice) {
        where.pricePerDay = {};
        if (minPrice) where.pricePerDay.gte = Number(minPrice);
        if (maxPrice) where.pricePerDay.lte = Number(maxPrice);
      }

      if (isAirConditioned !== undefined) {
        where.isAirConditioned = isAirConditioned === 'true';
      }

      // Build sort conditions
      const orderBy: any = {};
      if (sortBy === 'price') {
        orderBy.pricePerDay = sortOrder;
      } else if (sortBy === 'rating') {
        orderBy.rating = sortOrder;
      } else if (sortBy === 'capacity') {
        orderBy.capacity = sortOrder;
      } else if (sortBy === 'name') {
        orderBy.name = sortOrder;
      } else {
        orderBy.createdAt = sortOrder;
      }

      const [venues, total] = await Promise.all([
        prisma.venue.findMany({
          where,
          include: {
            city: true,
            area: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            venueAmenities: {
              include: {
                amenity: true,
              },
            },
            _count: {
              select: {
                reviews: true,
                bookings: true,
              },
            },
          },
          orderBy,
          skip,
          take,
        }),
        prisma.venue.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.json({
        success: true,
        data: {
          venues: venues.map(venue => ({
            ...venue,
            amenities: venue.venueAmenities.map(va => va.amenity),
            primaryImage: venue.images[0]?.url || null,
            reviewCount: venue._count.reviews,
            bookingCount: venue._count.bookings,
          })),
          pagination: {
            page: Number(page),
            limit: take,
            total,
            totalPages,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1,
          },
        },
      });
    } catch (error) {
      logger.error('Get venues error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch venues',
      });
    }
  }

  async getVenueById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const venue = await prisma.venue.findUnique({
        where: { id },
        include: {
          city: true,
          area: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          images: {
            orderBy: { order: 'asc' },
          },
          venueAmenities: {
            include: {
              amenity: true,
            },
          },
          reviews: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
      });

      if (!venue) {
        return res.status(404).json({
          success: false,
          error: 'Venue not found',
        });
      }

      if (!venue.isActive || !venue.isApproved) {
        return res.status(404).json({
          success: false,
          error: 'Venue not available',
        });
      }

      res.json({
        success: true,
        data: {
          ...venue,
          amenities: venue.venueAmenities.map(va => va.amenity),
          reviewCount: venue._count.reviews,
          bookingCount: venue._count.bookings,
        },
      });
    } catch (error) {
      logger.error('Get venue by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch venue',
      });
    }
  }

  async createVenue(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        name,
        description,
        address,
        cityId,
        areaId,
        capacity,
        pricePerDay,
        pricePerHour,
        isAirConditioned,
        amenityIds,
        contactPerson,
        contactPhone,
        contactEmail,
        latitude,
        longitude,
      } = req.body;

      const userId = req.user!.id;

      // Create venue
      const venue = await prisma.venue.create({
        data: {
          name,
          description,
          address,
          cityId,
          areaId,
          capacity,
          pricePerDay,
          pricePerHour,
          isAirConditioned,
          contactPerson,
          contactPhone,
          contactEmail,
          latitude,
          longitude,
          ownerId: userId,
          isApproved: req.user!.role === UserRole.ADMIN,
        },
        include: {
          city: true,
          area: true,
        },
      });

      logger.info(`Venue created: ${venue.name} by user ${userId}`);

      res.status(201).json({
        success: true,
        data: venue,
        message: 'Venue created successfully',
      });
    } catch (error) {
      logger.error('Create venue error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create venue',
      });
    }
  }

  async updateVenue(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Find venue and check ownership
      const existingVenue = await prisma.venue.findUnique({
        where: { id },
      });

      if (!existingVenue) {
        return res.status(404).json({
          success: false,
          error: 'Venue not found',
        });
      }

      // Check if user can update this venue
      if (userRole !== UserRole.ADMIN && existingVenue.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this venue',
        });
      }

      const updateData = req.body;

      const venue = await prisma.venue.update({
        where: { id },
        data: updateData,
        include: {
          city: true,
          area: true,
        },
      });

      res.json({
        success: true,
        data: venue,
        message: 'Venue updated successfully',
      });
    } catch (error) {
      logger.error('Update venue error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update venue',
      });
    }
  }

  async deleteVenue(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const venue = await prisma.venue.findUnique({
        where: { id },
      });

      if (!venue) {
        return res.status(404).json({
          success: false,
          error: 'Venue not found',
        });
      }

      if (userRole !== UserRole.ADMIN && venue.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this venue',
        });
      }

      await prisma.venue.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Venue deleted successfully',
      });
    } catch (error) {
      logger.error('Delete venue error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete venue',
      });
    }
  }

  async getVenueAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const availability = await prisma.venueAvailability.findMany({
        where: { venueId: id },
        orderBy: { date: 'asc' },
      });

      res.json({
        success: true,
        data: availability,
      });
    } catch (error) {
      logger.error('Get venue availability error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch venue availability',
      });
    }
  }

  async uploadImages(req: AuthenticatedRequest, res: Response) {
    try {
      res.json({
        success: true,
        message: 'Image upload endpoint - implementation pending',
      });
    } catch (error) {
      logger.error('Upload venue images error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload images',
      });
    }
  }
}
