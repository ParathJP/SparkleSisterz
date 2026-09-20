const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

// Cloudinary keeps images alive across restarts — hosts like Render wipe local disk.
// Falls back to local disk so `npm run dev` works without Cloudinary credentials.
function buildStorage() {
  if (!hasCloudinary) {
    const UPLOADS_DIR = path.join(__dirname, '../uploads');
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    return multer.diskStorage({
      destination: (req, file, cb) => cb(null, UPLOADS_DIR),
      filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
    });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'sparkle-sisterz/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    },
  });
}

const upload = multer({
  storage: buildStorage(),
  fileFilter: (req, file, cb) => {
    ALLOWED_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG, PNG, WebP allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Cloudinary returns an absolute URL on `path`; disk storage returns a local filename.
const fileToUrl = (file) => (hasCloudinary ? file.path : `/uploads/${file.filename}`);

module.exports = { upload, fileToUrl, hasCloudinary };
