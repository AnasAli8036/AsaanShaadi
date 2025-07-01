"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../utils/database");
const auth_1 = require("../utils/auth");
const logger_1 = require("../utils/logger");
class AuthController {
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone, role = client_1.UserRole.USER } = req.body;
            // Check if user already exists
            const existingUser = await database_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'User with this email already exists',
                });
            }
            // Hash password
            const hashedPassword = await (0, auth_1.hashPassword)(password);
            // Create user
            const user = await database_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phone,
                    role,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    isVerified: true,
                    createdAt: true,
                },
            });
            // Generate token
            const token = (0, auth_1.generateToken)({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            logger_1.logger.info(`User registered: ${user.email}`);
            res.status(201).json({
                success: true,
                data: {
                    user,
                    token,
                },
                message: 'User registered successfully',
            });
        }
        catch (error) {
            logger_1.logger.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: 'Registration failed',
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Find user
            const user = await database_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials',
                });
            }
            // Check password
            const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials',
                });
            }
            // Generate token
            const token = (0, auth_1.generateToken)({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            logger_1.logger.info(`User logged in: ${user.email}`);
            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        role: user.role,
                        isVerified: user.isVerified,
                        createdAt: user.createdAt,
                    },
                    token,
                },
                message: 'Login successful',
            });
        }
        catch (error) {
            logger_1.logger.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Login failed',
            });
        }
    }
    async verifyEmail(req, res) {
        try {
            // Email verification logic would go here
            // For now, just return success
            res.json({
                success: true,
                message: 'Email verification feature coming soon',
            });
        }
        catch (error) {
            logger_1.logger.error('Email verification error:', error);
            res.status(500).json({
                success: false,
                error: 'Email verification failed',
            });
        }
    }
    async forgotPassword(req, res) {
        try {
            // Forgot password logic would go here
            res.json({
                success: true,
                message: 'Password reset feature coming soon',
            });
        }
        catch (error) {
            logger_1.logger.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                error: 'Forgot password failed',
            });
        }
    }
    async resetPassword(req, res) {
        try {
            // Reset password logic would go here
            res.json({
                success: true,
                message: 'Password reset feature coming soon',
            });
        }
        catch (error) {
            logger_1.logger.error('Reset password error:', error);
            res.status(500).json({
                success: false,
                error: 'Password reset failed',
            });
        }
    }
    async refreshToken(req, res) {
        try {
            // Refresh token logic would go here
            res.json({
                success: true,
                message: 'Token refresh feature coming soon',
            });
        }
        catch (error) {
            logger_1.logger.error('Token refresh error:', error);
            res.status(500).json({
                success: false,
                error: 'Token refresh failed',
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map