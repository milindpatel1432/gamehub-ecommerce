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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};