const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Order = require('../models/Order');

// POST /api/orders — public
router.post('/', async (req, res) => {
  try {
    const { items, customer, total, paymentMethod } = req.body;

    if (!items?.length || !customer || !total) {
      return res.status(400).json({ message: 'Order items, customer details, and total are required' });
    }
    if (!customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ message: 'Customer name, phone, and address are required' });
    }

    // Store only essential product info
    const sanitizedItems = items.map((item) => ({
      product: {
        id:       item.product._id || item.product.id,
        name:     item.product.name,
        price:    item.product.price,
        category: item.product.category,
        images:   item.product.images,
      },
      quantity: item.quantity,
    }));

    const order = await Order.create({
      items: sanitizedItems,
      customer,
      total,
      paymentMethod: paymentMethod || 'cod',
    });

    // Build WhatsApp message
    const itemsText = sanitizedItems
      .map((item) => `• ${item.product.name} x${item.quantity} = ₹${item.product.price * item.quantity}`)
      .join('\n');

    const whatsappMessage = encodeURIComponent(
      `🛍️ *New Order - Sparkle Sisterz*\n\n` +
      `*Order ID:* ${order._id}\n\n` +
      `*Items:*\n${itemsText}\n\n` +
      `*Total:* ₹${total}\n` +
      `*Payment:* ${paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}\n\n` +
      `*Customer:*\n` +
      `Name: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${customer.address}, ${customer.city} - ${customer.pincode}`
    );

    const whatsappUrl = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${whatsappMessage}`;
    res.status(201).json({ order, whatsappUrl });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// GET /api/orders — admin only
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// PUT /api/orders/:id/status — admin only
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
