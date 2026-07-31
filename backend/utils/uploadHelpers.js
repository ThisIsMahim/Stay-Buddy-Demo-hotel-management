const cloudinary = require('../config/cloudinary');

/**
 * Uploads an array of image strings (Base64 data-URLs or regular URLs) to Cloudinary.
 * @param {string[]} images - Array of image strings
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string[]>} - Array of Cloudinary secure URLs
 */
const uploadImages = async (images, folder = 'staybuddy') => {
  if (!images || !Array.isArray(images)) return [];
  
  const uploadPromises = images.map(async (img) => {
    // If it's a data URL (Base64)
    if (img && img.startsWith('data:image')) {
      try {
        const res = await cloudinary.uploader.upload(img, {
          folder: folder,
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
        });
        return res.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return null; // Or throw error
      }
    }
    // If it's already a URL, just return it
    return img;
  });

  const results = await Promise.all(uploadPromises);
  return results.filter(url => url !== null);
};

module.exports = {
  uploadImages
};
