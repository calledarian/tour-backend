import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'tour-packages',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'heic', 'heif', 'avif'],
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
        fileSize: 10 * 1024 * 1024,
    }),

});
