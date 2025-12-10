import React from 'react';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';
import DraftProductCard from './DraftProductCard';

const ProductGrid = ({ products, onView, onEdit, onDelete, onPublish, isDraftMode = false }) => (
  <div className="space-y-6">

    {products.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product =>
          isDraftMode ? (
            <DraftProductCard
              key={product.id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublish={onPublish}
            />
          ) : (
            <ProductCard
              key={product.id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        )}
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    )}

    {products.length > 0 && (
      <div className="flex items-center justify-center pt-2">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{products.length}</span>{' '}
          {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>
    )}

  </div>
);

export default ProductGrid;
