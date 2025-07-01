import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../utils/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { logger } from '../utils/logger';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phone, role = UserRole.USER } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
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
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      logger.info(`User registered: ${user.email}`);

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      logger.info(`User logged in: ${user.email}`);

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
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
      });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      // Email verification logic would go here
      // For now, just return success
      res.json({
        success: true,
        message: 'Email verification feature coming soon',
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Email verification failed',
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      // Forgot password logic would go here
      res.json({
        success: true,
        message: 'Password reset feature coming soon',
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Forgot password failed',
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      // Reset password logic would go here
      res.json({
        success: true,
        message: 'Password reset feature coming soon',
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Password reset failed',
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      // Refresh token logic would go here
      res.json({
        success: true,
        message: 'Token refresh feature coming soon',
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        error: 'Token refresh failed',
      });
    }
  }
}
