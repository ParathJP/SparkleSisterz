const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const Product = require('../models/Product');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPEG, PNG, WebP allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET /api/products — public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    const { category, featured, search } = req.query;

    if (category) filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// POST /api/products — admin only
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, stock, featured } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const imageUrls = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      images: imageUrls,
      stock: parseInt(stock) || 0,
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, existingImages } = req.body;

    const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const keptImages = existingImages
      ? Array.isArray(existingImages) ? existingImages : [existingImages]
      : [];

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
        images: [...keptImages, ...newImages],
      },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
