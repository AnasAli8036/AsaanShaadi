"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const auth_1 = require("../utils/auth");
const database_1 = require("../utils/database");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access token required',
            });
        }
        const token = authHeader.substring(7);
        const decoded = (0, auth_1.verifyToken)(token);
        // Verify user still exists
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, isVerified: true },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found',
            });
        }
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                error: 'Please verify your email address',
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
            });
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = (0, auth_1.verifyToken)(token);
            const user = await database_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true, role: true, isVerified: true },
            });
            if (user && user.isVerified) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        // Continue without authentication
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map