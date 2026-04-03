const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

const readOrders = () => {
  const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeOrders = (orders) => {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

// POST /api/orders — public (place an order)
router.post('/', (req, res) => {
  try {
    const { items, customer, total, paymentMethod } = req.body;

    if (!items || !items.length || !customer || !total) {
      return res.status(400).json({ message: 'Order items, customer details, and total are required' });
    }

    if (!customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ message: 'Customer name, phone, and address are required' });
    }

    const orders = readOrders();
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items,
      customer,
      total,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    writeOrders(orders);

    // Build WhatsApp message
    const itemsText = items
      .map((item) => `• ${item.product.name} x${item.quantity} = ₹${item.product.price * item.quantity}`)
      .join('\n');

    const whatsappMessage = encodeURIComponent(
      `🛍️ *New Order - Sparkle Sisterz*\n\n` +
      `*Order ID:* ${newOrder.id}\n\n` +
      `*Items:*\n${itemsText}\n\n` +
      `*Total:* ₹${total}\n` +
      `*Payment:* ${paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}\n\n` +
      `*Customer:*\n` +
      `Name: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${customer.address}, ${customer.city} - ${customer.pincode}`
    );

    const whatsappUrl = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    res.status(201).json({ order: newOrder, whatsappUrl });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// GET /api/orders — admin only
router.get('/', authMiddleware, (req, res) => {
  try {
    const orders = readOrders();
    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// PUT /api/orders/:id/status — admin only
router.put('/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const orders = readOrders();
    const index = orders.findIndex((o) => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Order not found' });

    orders[index].status = status;
    writeOrders(orders);
    res.json(orders[index]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
