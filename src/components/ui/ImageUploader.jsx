import { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { successToast, errorToast } from '../../utils/toast';

export default function ImageUploader({
  value = '', // URL string for single upload, or array of URL strings for multiple
  onChange,
  multiple = false,
  label = 'Product Cover Image',
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Helper to get array representation of current values
  const getImagesArray = () => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    const imagesToUpload = multiple ? files : [files[0]];
    const uploadedUrls = [...getImagesArray()];

    try {
      for (let i = 0; i < imagesToUpload.length; i++) {
        const file = imagesToUpload[i];
        
        // Validation: file type
        if (!file.type.startsWith('image/')) {
          errorToast('File must be an image!');
          continue;
        }
        
        // Validation: file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          errorToast('Image must be under 5MB!');
          continue;
        }

        // Upload single file
        const res = await uploadService.uploadImage(file, (percent) => {
          setUploadProgress(percent);
        });

        if (res.success && res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }

      // Propagate state back to parent
      if (multiple) {
        onChange(uploadedUrls);
      } else {
        onChange(uploadedUrls[uploadedUrls.length - 1] || '');
      }

      successToast(imagesToUpload.length > 1 ? 'Images uploaded successfully!' : 'Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Error uploading image to server.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;
    await uploadFiles(files);
  };

  const handleRemove = async (indexToRemove) => {
    const images = getImagesArray();
    const targetUrl = images[indexToRemove];

    // Optional: Extract Cloudinary public ID to delete from cloud
    // Cloudinary urls are formatted like: res.cloudinary.com/cloud_name/image/upload/v12345/gamehub/public_id.jpg
    const match = targetUrl.match(/\/gamehub\/[^/.]+/);
    if (match) {
      // Reconstruct publicId e.g. "gamehub/public_id"
      const publicId = `gamehub${match[0].slice(8)}`;
      try {
        await uploadService.deleteImage(publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err);
      }
    }

    const filtered = images.filter((_, idx) => idx !== indexToRemove);

    if (multiple) {
      onChange(filtered);
    } else {
      onChange('');
    }
    successToast('Image removed.');
  };

  const imagesList = getImagesArray();

  return (
    <div className="space-y-3 text-left">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
        {label} {multiple ? '(Multiple Allowed)' : ''}
      </label>

      {/* Drag & Drop Zone */}
      {(multiple || imagesList.length === 0) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-36 ${
            isDragging
              ? 'border-gaming-cyan bg-gaming-cyan/5 shadow-[0_0_15px_rgba(0,229,255,0.1)]'
              : 'border-gaming-border bg-gaming-black/40 hover:border-gaming-cyan/60 hover:bg-gaming-black/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={multiple}
            accept="image/*"
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-3 w-full max-w-[200px] flex flex-col items-center">
              <UploadCloud className="h-8 w-8 text-gaming-cyan animate-bounce" />
              <div className="w-full bg-gaming-border h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gaming-cyan h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Uploading ({uploadProgress}%)
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <UploadCloud className="h-8 w-8 text-slate-500 mx-auto" />
              <div className="text-xs text-slate-300">
                <span className="text-gaming-cyan font-bold hover:underline">Click to upload</span> or drag and drop images
              </div>
              <div className="text-[9px] text-slate-600 uppercase font-semibold tracking-wider">
                Supports JPG, PNG, WEBP (Max 5MB)
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Previews List */}
      {imagesList.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 pt-1.5">
          {imagesList.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl border border-gaming-border bg-gaming-black/40 overflow-hidden group shadow-lg"
            >
              <img src={url} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
              
              {/* Overlay hover remove button */}
              <div className="absolute inset-0 bg-gaming-dark/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Cover/Thumbnail indicator for multiple */}
              {multiple && idx === 0 && (
                <span className="absolute bottom-1 left-1 text-[8px] font-bold uppercase bg-gaming-cyan text-gaming-black px-1.5 rounded-sm">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
