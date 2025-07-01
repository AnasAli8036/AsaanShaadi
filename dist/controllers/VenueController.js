"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenueController = void 0;
const database_1 = require("../utils/database");
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
class VenueController {
    async getVenues(req, res) {
        try {
            const { page = 1, limit = 12, city, area, minCapacity, maxCapacity, minPrice, maxPrice, isAirConditioned, amenities, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const take = Number(limit);
            // Build filter conditions
            const where = {
                isActive: true,
                isApproved: true,
            };
            if (city) {
                where.city = {
                    name: { contains: city, mode: 'insensitive' }
                };
            }
            if (area) {
                where.area = {
                    name: { contains: area, mode: 'insensitive' }
                };
            }
            if (minCapacity || maxCapacity) {
                where.capacity = {};
                if (minCapacity)
                    where.capacity.gte = Number(minCapacity);
                if (maxCapacity)
                    where.capacity.lte = Number(maxCapacity);
            }
            if (minPrice || maxPrice) {
                where.pricePerDay = {};
                if (minPrice)
                    where.pricePerDay.gte = Number(minPrice);
                if (maxPrice)
                    where.pricePerDay.lte = Number(maxPrice);
            }
            if (isAirConditioned !== undefined) {
                where.isAirConditioned = isAirConditioned === 'true';
            }
            // Build sort conditions
            const orderBy = {};
            if (sortBy === 'price') {
                orderBy.pricePerDay = sortOrder;
            }
            else if (sortBy === 'rating') {
                orderBy.rating = sortOrder;
            }
            else if (sortBy === 'capacity') {
                orderBy.capacity = sortOrder;
            }
            else if (sortBy === 'name') {
                orderBy.name = sortOrder;
            }
            else {
                orderBy.createdAt = sortOrder;
            }
            const [venues, total] = await Promise.all([
                database_1.prisma.venue.findMany({
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
                database_1.prisma.venue.count({ where }),
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
        }
        catch (error) {
            logger_1.logger.error('Get venues error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch venues',
            });
        }
    }
    async getVenueById(req, res) {
        try {
            const { id } = req.params;
            const venue = await database_1.prisma.venue.findUnique({
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
        }
        catch (error) {
            logger_1.logger.error('Get venue by ID error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch venue',
            });
        }
    }
    async createVenue(req, res) {
        try {
            const { name, description, address, cityId, areaId, capacity, pricePerDay, pricePerHour, isAirConditioned, amenityIds, contactPerson, contactPhone, contactEmail, latitude, longitude, } = req.body;
            const userId = req.user.id;
            // Create venue
            const venue = await database_1.prisma.venue.create({
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
                    isApproved: req.user.role === client_1.UserRole.ADMIN,
                },
                include: {
                    city: true,
                    area: true,
                },
            });
            logger_1.logger.info(`Venue created: ${venue.name} by user ${userId}`);
            res.status(201).json({
                success: true,
                data: venue,
                message: 'Venue created successfully',
            });
        }
        catch (error) {
            logger_1.logger.error('Create venue error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create venue',
            });
        }
    }
    async updateVenue(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
            // Find venue and check ownership
            const existingVenue = await database_1.prisma.venue.findUnique({
                where: { id },
            });
            if (!existingVenue) {
                return res.status(404).json({
                    success: false,
                    error: 'Venue not found',
                });
            }
            // Check if user can update this venue
            if (userRole !== client_1.UserRole.ADMIN && existingVenue.ownerId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to update this venue',
                });
            }
            const updateData = req.body;
            const venue = await database_1.prisma.venue.update({
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
        }
        catch (error) {
            logger_1.logger.error('Update venue error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update venue',
            });
        }
    }
    async deleteVenue(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
            const venue = await database_1.prisma.venue.findUnique({
                where: { id },
            });
            if (!venue) {
                return res.status(404).json({
                    success: false,
                    error: 'Venue not found',
                });
            }
            if (userRole !== client_1.UserRole.ADMIN && venue.ownerId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to delete this venue',
                });
            }
            await database_1.prisma.venue.update({
                where: { id },
                data: { isActive: false },
            });
            res.json({
                success: true,
                message: 'Venue deleted successfully',
            });
        }
        catch (error) {
            logger_1.logger.error('Delete venue error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete venue',
            });
        }
    }
    async getVenueAvailability(req, res) {
        try {
            const { id } = req.params;
            const availability = await database_1.prisma.venueAvailability.findMany({
                where: { venueId: id },
                orderBy: { date: 'asc' },
            });
            res.json({
                success: true,
                data: availability,
            });
        }
        catch (error) {
            logger_1.logger.error('Get venue availability error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch venue availability',
            });
        }
    }
    async uploadImages(req, res) {
        try {
            res.json({
                success: true,
                message: 'Image upload endpoint - implementation pending',
            });
        }
        catch (error) {
            logger_1.logger.error('Upload venue images error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to upload images',
            });
        }
    }
}
exports.VenueController = VenueController;
//# sourceMappingURL=VenueController.js.map