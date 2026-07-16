import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';

const router = express.Router();

// Protected admin routes for image handling
router.post('/image', protect, authorize('admin'), upload.single('image'), uploadImage);
router.delete('/image/:publicId(*)', protect, authorize('admin'), deleteImage);

export default router;
