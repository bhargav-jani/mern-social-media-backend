import {v2 as cloudinary} from 'cloudinary';

export const uploadToCloudinary = async (req, res, next) => {
    try {
        const picturePath = req.body.picturePath;

        if(!picturePath) return next();

        const response = await cloudinary.uploader.upload(picturePath, {folder: "social-media-mern"});

        req.cloudinarySecureURL = response.secure_url;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
