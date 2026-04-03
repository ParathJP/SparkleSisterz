'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CATEGORY_GRADIENTS: Record<string, string> = {
  Necklaces: 'from-terracotta-300 to-terracotta-500',
  Earrings:  'from-terracotta-200 to-terracotta-400',
  Bracelets: 'from-amber-300 to-terracotta-400',
  Rings:     'from-terracotta-400 to-terracotta-600',
  Anklets:   'from-orange-200 to-terracotta-300',
  Sets:      'from-terracotta-300 to-terracotta-700',
};

interface CustomerForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [customer, setCustomer] = useState<CustomerForm>({
    name: '', phone: '', address: '', city: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!customer.name || !customer.phone || !customer.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        items,
        customer,
        total,
        paymentMethod,
      });

      const { whatsappUrl } = res.data;
      clearCart();
      setOrdered(true);

      // Open WhatsApp
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank');
      }
      toast.success('Order placed successfully! 🎉');
    } catch {
      toast.error('Failed to place order. Please try via WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (ordered) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-serif font-bold text-terracotta-800 mb-3">Order Placed!</h1>
        <p className="text-terracotta-600 mb-2">
          Your order has been received. A WhatsApp message has been sent to confirm your order.
        </p>
        <p className="text-terracotta-400 text-sm mb-8">
          If WhatsApp didn't open, please message us directly with your order details.
        </p>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h1 className="text-3xl font-serif font-bold text-terracotta-800 mb-3">Your Cart is Empty</h1>
        <p className="text-terracotta-500 mb-8">
          Looks like you haven't added anything yet. Explore our beautiful collection!
        </p>
        <Link href="/products" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products" className="text-terracotta-500 hover:text-terracotta-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="section-heading">My Cart</h1>
        <span className="text-terracotta-400 text-sm">({items.length} item{items.length > 1 ? 's' : ''})</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const gradient = CATEGORY_GRADIENTS[item.product.category] || 'from-terracotta-200 to-terracotta-500';
            const imageUrl = item.product.images?.[0]
              ? item.product.images[0].startsWith('http')
                ? item.product.images[0]
                : `${API_BASE}${item.product.images[0]}`
              : null;

            return (
              <div key={item.product.id} className="card p-4 flex gap-4">
                {/* Image */}
                <div
                  className={`relative w-20 h-20 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0 overflow-hidden`}
                >
                  {imageUrl ? (
                    <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🌸</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-medium text-terracotta-800 truncate">{item.product.name}</h3>
                  <p className="text-sm text-terracotta-400 mb-2">{item.product.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-terracotta-200 rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-terracotta-50 transition-colors"
                      >
                        <Minus size={14} className="text-terracotta-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-terracotta-50 transition-colors"
                      >
                        <Plus size={14} className="text-terracotta-600" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-terracotta-700">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary + Form */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-terracotta-800 text-xl mb-4">
              <ShoppingBag size={20} className="inline mr-2" />
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-terracotta-600">
                  <span className="truncate flex-1 pr-2">{item.product.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-terracotta-100 pt-4 flex justify-between font-bold text-terracotta-800 text-lg">
              <span>Total</span>
              <span className="text-terracotta-600">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Customer Details + Submit */}
          <form onSubmit={handleOrder} className="card p-6 space-y-4">
            <h2 className="font-serif font-semibold text-terracotta-800 text-xl mb-2">Delivery Details</h2>

            <div>
              <label className="block text-sm font-medium text-terracotta-700 mb-1">Full Name *</label>
              <input
                name="name"
                value={customer.name}
                onChange={handleInput}
                required
                placeholder="Your name"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-terracotta-700 mb-1">Phone Number *</label>
              <input
                name="phone"
                type="tel"
                value={customer.phone}
                onChange={handleInput}
                required
                placeholder="10-digit mobile number"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-terracotta-700 mb-1">Address *</label>
              <input
                name="address"
                value={customer.address}
                onChange={handleInput}
                required
                placeholder="House no, street, area"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-terracotta-700 mb-1">City *</label>
                <input
                  name="city"
                  value={customer.city}
                  onChange={handleInput}
                  required
                  placeholder="City"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-terracotta-700 mb-1">Pincode</label>
                <input
                  name="pincode"
                  value={customer.pincode}
                  onChange={handleInput}
                  placeholder="Pincode"
                  className="input-field"
                />
              </div>
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-medium text-terracotta-700 mb-2">Payment Method</label>
              <div className="flex gap-3">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery' },
                  { value: 'upi', label: '📱 UPI' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentMethod(opt.value as 'cod' | 'upi')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      paymentMethod === opt.value
                        ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                        : 'border-terracotta-200 text-terracotta-500 hover:border-terracotta-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-whatsapp w-full justify-center text-base disabled:opacity-60"
            >
              <MessageCircle size={18} />
              {submitting ? 'Placing Order...' : 'Place Order via WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
