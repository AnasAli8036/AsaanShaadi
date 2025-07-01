import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { UserRole } from '@prisma/client';

export class CatererController {
  async getCaterers(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        page = 1,
        limit = 12,
        serviceAreas,
        cuisine,
        minPrice,
        maxPrice,
        minimumOrder,
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

      if (serviceAreas) {
        where.serviceAreas = {
          some: {
            city: {
              name: { in: Array.isArray(serviceAreas) ? serviceAreas : [serviceAreas] }
            }
          }
        };
      }

      if (cuisine) {
        where.catererCuisines = {
          some: {
            cuisine: {
              name: { in: Array.isArray(cuisine) ? cuisine : [cuisine] }
            }
          }
        };
      }

      if (minPrice || maxPrice) {
        where.pricePerPerson = {};
        if (minPrice) where.pricePerPerson.gte = Number(minPrice);
        if (maxPrice) where.pricePerPerson.lte = Number(maxPrice);
      }

      if (minimumOrder) {
        where.minimumOrder = { lte: Number(minimumOrder) };
      }

      // Build sort conditions
      const orderBy: any = {};
      if (sortBy === 'price') {
        orderBy.pricePerPerson = sortOrder;
      } else if (sortBy === 'rating') {
        orderBy.rating = sortOrder;
      } else if (sortBy === 'name') {
        orderBy.name = sortOrder;
      } else {
        orderBy.createdAt = sortOrder;
      }

      const [caterers, total] = await Promise.all([
        prisma.caterer.findMany({
          where,
          include: {
            serviceAreas: {
              include: {
                city: true,
              },
            },
            catererCuisines: {
              include: {
                cuisine: true,
              },
            },
            specialties: {
              include: {
                specialty: true,
              },
            },
            images: {
              where: { isPrimary: true },
              take: 1,
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
        prisma.caterer.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.json({
        success: true,
        data: {
          caterers: caterers.map(caterer => ({
            ...caterer,
            serviceAreaNames: caterer.serviceAreas.map(sa => sa.city.name),
            cuisineNames: caterer.catererCuisines.map(cc => cc.cuisine.name),
            specialtyNames: caterer.specialties.map(cs => cs.specialty.name),
            primaryImage: caterer.images[0]?.url || null,
            reviewCount: caterer._count.reviews,
            bookingCount: caterer._count.bookings,
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
      logger.error('Get caterers error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch caterers',
      });
    }
  }

  async getCatererById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const caterer = await prisma.caterer.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          serviceAreas: {
            include: {
              city: true,
            },
          },
          catererCuisines: {
            include: {
              cuisine: true,
            },
          },
          specialties: {
            include: {
              specialty: true,
            },
          },
          images: {
            orderBy: { order: 'asc' },
          },
          menuItems: {
            where: { isAvailable: true },
            orderBy: { category: 'asc' },
          },
          packages: {
            where: { isActive: true },
            orderBy: { pricePerPerson: 'asc' },
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

      if (!caterer) {
        return res.status(404).json({
          success: false,
          error: 'Caterer not found',
        });
      }

      if (!caterer.isActive || !caterer.isApproved) {
        return res.status(404).json({
          success: false,
          error: 'Caterer not available',
        });
      }

      res.json({
        success: true,
        data: {
          ...caterer,
          serviceAreaNames: caterer.serviceAreas.map(sa => sa.city.name),
          cuisineNames: caterer.catererCuisines.map(cc => cc.cuisine.name),
          specialtyNames: caterer.specialties.map(cs => cs.specialty.name),
          reviewCount: caterer._count.reviews,
          bookingCount: caterer._count.bookings,
        },
      });
    } catch (error) {
      logger.error('Get caterer by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch caterer',
      });
    }
  }

  async createCaterer(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        name,
        description,
        pricePerPerson,
        minimumOrder,
        contactPerson,
        contactPhone,
        contactEmail,
        serviceAreaIds,
        cuisineIds,
        specialtyIds,
      } = req.body;

      const userId = req.user!.id;

      // Create caterer
      const caterer = await prisma.caterer.create({
        data: {
          name,
          description,
          pricePerPerson,
          minimumOrder,
          contactPerson,
          contactPhone,
          contactEmail,
          ownerId: userId,
          isApproved: req.user!.role === UserRole.ADMIN,
        },
      });

      // Add service areas
      if (serviceAreaIds && serviceAreaIds.length > 0) {
        await prisma.catererServiceArea.createMany({
          data: serviceAreaIds.map((cityId: string) => ({
            catererId: caterer.id,
            cityId,
          })),
        });
      }

      // Add cuisines
      if (cuisineIds && cuisineIds.length > 0) {
        await prisma.catererCuisine.createMany({
          data: cuisineIds.map((cuisineId: string) => ({
            catererId: caterer.id,
            cuisineId,
          })),
        });
      }

      // Add specialties
      if (specialtyIds && specialtyIds.length > 0) {
        await prisma.catererSpecialty.createMany({
          data: specialtyIds.map((specialtyId: string) => ({
            catererId: caterer.id,
            specialtyId,
          })),
        });
      }

      logger.info(`Caterer created: ${caterer.name} by user ${userId}`);

      res.status(201).json({
        success: true,
        data: caterer,
        message: 'Caterer created successfully',
      });
    } catch (error) {
      logger.error('Create caterer error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create caterer',
      });
    }
  }

  async updateCaterer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const existingCaterer = await prisma.caterer.findUnique({
        where: { id },
      });

      if (!existingCaterer) {
        return res.status(404).json({
          success: false,
          error: 'Caterer not found',
        });
      }

      if (userRole !== UserRole.ADMIN && existingCaterer.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this caterer',
        });
      }

      const updateData = req.body;
      
      const caterer = await prisma.caterer.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        data: caterer,
        message: 'Caterer updated successfully',
      });
    } catch (error) {
      logger.error('Update caterer error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update caterer',
      });
    }
  }

  async deleteCaterer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const caterer = await prisma.caterer.findUnique({
        where: { id },
      });

      if (!caterer) {
        return res.status(404).json({
          success: false,
          error: 'Caterer not found',
        });
      }

      if (userRole !== UserRole.ADMIN && caterer.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this caterer',
        });
      }

      await prisma.caterer.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Caterer deleted successfully',
      });
    } catch (error) {
      logger.error('Delete caterer error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete caterer',
      });
    }
  }
}
