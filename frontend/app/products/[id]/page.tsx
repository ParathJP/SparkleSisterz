'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, MessageCircle, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-terracotta-100 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-terracotta-100 rounded w-1/3" />
            <div className="h-10 bg-terracotta-100 rounded w-2/3" />
            <div className="h-8 bg-terracotta-100 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [];
  const currentImageUrl = images[activeImage]
    ? images[activeImage].startsWith('http')
      ? images[activeImage]
      : `${API_BASE}${images[activeImage]}`
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWhatsAppOrder = () => {
    const msg = encodeURIComponent(
      `Hi! I'd like to order:\n\n` +
      `*${product.name}*\n` +
      `Qty: ${quantity}\n` +
      `Price: ₹${(product.price * quantity).toLocaleString('en-IN')}\n\n` +
      `Please let me know the next steps. Thank you! 🌸`
    );
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-terracotta-500 hover:text-terracotta-700 mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-terracotta-200 to-terracotta-400 mb-4">
            {currentImageUrl ? (
              <Image src={currentImageUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🌸</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => {
                const url = img.startsWith('http') ? img : `${API_BASE}${img}`;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-terracotta-500' : 'border-transparent'
                    }`}
                  >
                    <Image src={url} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-block text-xs text-terracotta-400 uppercase tracking-widest font-medium bg-terracotta-50 px-3 py-1 rounded-full mb-3">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-terracotta-800 mb-3">
            {product.name}
          </h1>
          <div className="text-3xl font-bold text-terracotta-600 mb-4">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <p className="text-terracotta-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className="text-sm text-terracotta-500">
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-terracotta-700">Quantity:</span>
                <div className="flex items-center border border-terracotta-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-medium text-terracotta-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button onClick={handleWhatsAppOrder} className="btn-whatsapp flex-1 justify-center">
                  <MessageCircle size={18} /> Order via WhatsApp
                </button>
              </div>
            </>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-terracotta-100">
            {['Handcrafted', 'Terracotta Clay', 'Eco-friendly', 'Lightweight'].map((tag) => (
              <span key={tag} className="text-xs bg-terracotta-50 text-terracotta-500 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Back to shop */}
      <div className="mt-12 text-center">
        <Link href="/products" className="btn-secondary">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
