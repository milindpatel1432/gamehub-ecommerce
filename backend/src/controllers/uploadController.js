import cloudinary from '../config/cloudinary.js';

// ==========================================
// Upload Single Image to Cloudinary (Buffer)
// ==========================================
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload',
      });
    }

    // Stream buffer into Cloudinary upload_stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'gamehub' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Image upload to Cloudinary failed',
            error: error.message
          });
        }

        res.status(200).json({
          success: true,
          message: 'Image uploaded successfully',
          data: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Image from Cloudinary (publicId)
// ==========================================
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary public ID is required for deletion',
      });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok' && result.result !== 'not found') {
      return res.status(400).json({
        success: false,
        message: 'Could not delete image or invalid public ID',
        data: result,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted from Cloudinary successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
