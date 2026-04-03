import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      </div>
    }>
      <ProductsClient />
    </Suspense>
  );
}
