const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          id:       String,
          name:     String,
          price:    Number,
          category: String,
          images:   [String],
        },
        quantity: Number,
      },
    ],
    customer: {
      name:    { type: String, required: true },
      phone:   { type: String, required: true },
      address: { type: String, required: true },
      city:    { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    total:         { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'upi'], default: 'cod' },
    status: {
      type:    String,
      enum:    ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
