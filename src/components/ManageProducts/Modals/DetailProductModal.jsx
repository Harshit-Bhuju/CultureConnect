import React from 'react';
import { X, Package, Edit } from 'lucide-react';

const DetailProductModal = ({ product, onClose, onEdit }) => (
     <>
    {/* Blurry background overlay */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      onClick={onClose} // Close modal on clicking outside
    />

  <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-t-lg" />
        <span className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
          {product.status}
        </span>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
          <span>🏷️</span> {product.category}
        </p>
        <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">PRICE</p>
            <p className="text-orange-500 font-bold text-2xl">${product.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">STOCK</p>
            <p className="font-bold text-2xl flex items-center gap-2">
              <Package size={24} />
              {product.stock} units
              {product.stock <= 10 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Low Stock</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6 border-t pt-4">
          <p>📅 Created: Feb 1, 2024</p>
          <p>🔄 Updated: Feb 5, 2024</p>
        </div>

        <button
          onClick={onEdit}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <Edit size={20} />
          Edit Product
        </button>
      </div>
    </div>
  </div>
  </>
);

export default DetailProductModal;
