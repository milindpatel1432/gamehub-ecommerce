import express from 'express';
import { submitEnquiry, getAllEnquiries } from '../controllers/enquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to submit any website form
router.post('/', submitEnquiry);

// Protected Admin route to list all enquiries
router.get('/', protect, authorize('admin'), getAllEnquiries);

export default router;
