import React from 'react';
import { Package, Tag, DollarSign, Clock, ArrowLeft } from 'lucide-react';


const ProductDetailPage = ({ product, onBack, onEdit }) => {


  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100 my-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button 
          onClick={onBack} 
          className="flex items-center text-gray-600 hover:text-orange-500 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Product List
        </button>
        <button
          onClick={() => onEdit(product)}
          className="bg-orange-500 text-white py-2 px-6 rounded-xl hover:bg-orange-600 flex items-center gap-2 transition-colors font-semibold"
        >
          Edit Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Image Column */}
        <div className="lg:col-span-1">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-96 object-cover rounded-xl shadow-lg border border-gray-200" 
          />
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2">
          <span className="text-sm text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Tag size={16} /> {product.category}
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className={`text-sm px-4 py-1.5 rounded-full font-bold ${
              product.status === 'Active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {product.status}
            </span>
          </div>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed border-b pb-8">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2 font-medium">
                <DollarSign size={18} className="text-green-600" /> PRICE
              </p>
              <p className="text-4xl font-black text-green-600">${product.price.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2 font-medium">
                <Package size={18} className="text-orange-500" /> STOCK
              </p>
              <p className={`text-4xl font-black flex items-center gap-2 ${product.stock <= 10 ? 'text-red-500' : 'text-gray-900'}`}>
                {product.stock}
                {product.stock <= 10 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Low Stock</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 gap-6">
            <p className="flex items-center gap-1">
              <Clock size={16} /> Created: Feb 1, 2024
            </p>
            <p className="flex items-center gap-1">
              <Clock size={16} /> Updated: Feb 5, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;