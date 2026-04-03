'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import api from '@/lib/api';

const CATEGORIES = ['All', 'Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Anklets', 'Sets'];

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'All'
  );

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-terracotta-400 uppercase tracking-widest text-sm font-medium mb-2">Explore</p>
        <h1 className="section-heading">Our Collection</h1>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-terracotta-300"
          />
          <input
            type="text"
            placeholder="Search jewellery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-terracotta-400" />
          <span className="text-sm text-terracotta-400 font-medium">{products.length} items</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all border ${
              activeCategory === cat
                ? 'bg-terracotta-500 text-white border-terracotta-500'
                : 'border-terracotta-200 text-terracotta-600 hover:border-terracotta-400 hover:bg-terracotta-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-square bg-terracotta-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-terracotta-100 rounded w-1/2" />
                <div className="h-4 bg-terracotta-100 rounded w-3/4" />
                <div className="h-4 bg-terracotta-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-terracotta-400">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try a different category or search term</p>
        </div>
      )}
    </div>
  );
}
