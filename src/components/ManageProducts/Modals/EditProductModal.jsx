import React from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';

const EditProductModal = ({ product, formData, setFormData, categories, onClose, onSubmit }) => (
  <>
    {/* Blurry background overlay */}
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={onClose}
    />
    
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Edit Product</h2>
            <p className="text-gray-500 mt-1">Update the product details for **{product.name}**.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-500 p-2 rounded-full transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Image Preview</label>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-inner" 
            />
          </div>

          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
          />
        </div>

        <div className="flex gap-4 justify-end p-6 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-8 py-3 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-8 py-3 font-semibold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </>
);

export default EditProductModal;