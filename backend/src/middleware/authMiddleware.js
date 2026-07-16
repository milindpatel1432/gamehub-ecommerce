import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // Token from Cookie
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // Token from Authorization Header
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // No Token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login first.',
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        // Find User
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {
        let message = 'Not authorized. Invalid token.';
        if (error.name === 'TokenExpiredError') {
            message = 'Not authorized. Token has expired.';
        }
        return res.status(401).json({
            success: false,
            message,
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Not authorized. Access denied for role: ${req.user?.role || 'guest'}.`,
            });
        }
        next();
    };
};