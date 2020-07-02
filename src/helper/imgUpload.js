const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const imgUpload = (imgContent) => {
    return cloudinary.uploader.upload(imgContent);
};
module.exports = imgUpload;
