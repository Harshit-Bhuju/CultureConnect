import React from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';

const PublishProductModal = ({ product, onClose, onPublish }) => {
  const productName = product.productName || product.name || 'this product';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Publish Product</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to publish <span className="font-semibold">"{productName}"</span>?
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-800 font-medium mb-2">
                  When you publish this product:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• It will be visible to all customers</li>
                  <li>• Customers can purchase this product</li>
                  <li>• It will appear in search results</li>
                  <li>• You can unpublish it anytime from product settings</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Make sure all product details, images, and pricing are correct before publishing.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            onClick={onPublish}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishProductModal;