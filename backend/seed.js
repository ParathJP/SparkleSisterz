require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Terracotta Floral Necklace',
    description: 'A beautifully handcrafted terracotta necklace featuring delicate floral motifs. Each piece is hand-painted with natural earthy tones, making it a unique wearable art. Perfect for ethnic wear and casual outfits.',
    price: 599, category: 'Necklaces', images: [], stock: 15, featured: true,
  },
  {
    name: 'Boho Terracotta Earrings',
    description: 'Lightweight and elegant boho-style earrings crafted from pure terracotta clay. Adorned with hand-painted geometric patterns in rich earthy colors. Comfortable for all-day wear.',
    price: 349, category: 'Earrings', images: [], stock: 25, featured: true,
  },
  {
    name: 'Tribal Terracotta Bracelet',
    description: 'Inspired by tribal art, this terracotta bracelet features intricate hand-carved designs. A statement piece that complements both traditional and contemporary looks.',
    price: 299, category: 'Bracelets', images: [], stock: 20, featured: true,
  },
  {
    name: 'Peacock Terracotta Pendant',
    description: 'A stunning peacock-motif pendant handcrafted from terracotta clay with vibrant hand-painting. Comes with an adjustable cotton cord. A true showstopper piece.',
    price: 449, category: 'Necklaces', images: [], stock: 10, featured: true,
  },
  {
    name: 'Traditional Jhumka Earrings',
    description: 'Classic jhumka-style earrings in terracotta with gold paint detailing. Lightweight yet bold, these are perfect for festive occasions and cultural events.',
    price: 399, category: 'Earrings', images: [], stock: 18, featured: true,
  },
  {
    name: 'Terracotta Anklet',
    description: 'Delicate terracotta anklet with tiny hand-shaped beads. Adds a beautiful earthy charm to your feet. Adjustable size, suitable for most ankle sizes.',
    price: 249, category: 'Anklets', images: [], stock: 30, featured: false,
  },
  {
    name: 'Mandala Terracotta Ring',
    description: 'A one-of-a-kind ring featuring a beautiful mandala design carved into terracotta clay. Hand-painted with mehndi-style patterns. Available in adjustable size.',
    price: 199, category: 'Rings', images: [], stock: 22, featured: false,
  },
  {
    name: 'Festival Jewellery Set',
    description: 'A complete festive jewellery set including a necklace, earrings, and bangles — all handcrafted from terracotta. Perfectly coordinated with matching motifs and colors.',
    price: 999, category: 'Sets', images: [], stock: 8, featured: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} products. Skipping seed.`);
  } else {
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
