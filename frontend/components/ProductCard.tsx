'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
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

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const gradient = CATEGORY_GRADIENTS[product.category] || 'from-terracotta-200 to-terracotta-500';
  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `${API_BASE}${product.images[0]}`
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.id}`} className="group card overflow-hidden block">
      {/* Image / Placeholder */}
      <div className={`relative w-full aspect-square bg-gradient-to-br ${gradient} overflow-hidden`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/80">
            <span className="text-5xl mb-2">🌸</span>
            <span className="text-xs font-medium uppercase tracking-wider">{product.category}</span>
          </div>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-xs text-terracotta-400 uppercase tracking-wider font-medium">
          {product.category}
        </span>
        <h3 className="font-serif font-medium text-terracotta-800 mt-1 mb-2 group-hover:text-terracotta-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-terracotta-600">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-terracotta-500 text-white p-2 rounded-full hover:bg-terracotta-600 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
