const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer config
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
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const readProducts = () => {
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeProducts = (products) => {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

// GET /api/products — public
router.get('/', (req, res) => {
  try {
    let products = readProducts();
    const { category, featured, search } = req.query;

    if (category) {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (featured === 'true') {
      products = products.filter((p) => p.featured);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — public
router.get('/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// POST /api/products — admin only
router.post('/', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    const { name, description, price, category, stock, featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const products = readProducts();
    const imageUrls = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const newProduct = {
      id: `prod-${uuidv4().slice(0, 8)}`,
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      images: imageUrls,
      stock: parseInt(stock) || 0,
      featured: featured === 'true' || featured === true,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, category, stock, featured, existingImages } = req.body;

    const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const keptImages = existingImages
      ? Array.isArray(existingImages)
        ? existingImages
        : [existingImages]
      : [];

    products[index] = {
      ...products[index],
      name: name || products[index].name,
      description: description !== undefined ? description : products[index].description,
      price: price !== undefined ? parseFloat(price) : products[index].price,
      category: category || products[index].category,
      stock: stock !== undefined ? parseInt(stock) : products[index].stock,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : products[index].featured,
      images: [...keptImages, ...newImages],
    };

    writeProducts(products);
    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    let products = readProducts();
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    products.splice(index, 1);
    writeProducts(products);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
