import React from 'react';
import { X, FileText, AlertCircle } from 'lucide-react';

const DraftProductModal = ({ product, onClose, onDraft }) => {
  const productName = product.productName || product.name || 'this product';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Move to Draft</h2>
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
            Are you sure you want to move <span className="font-semibold">"{productName}"</span> to drafts?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  When you move this product to draft:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• It will be hidden from all customers</li>
                  <li>• Customers cannot purchase this product</li>
                  <li>• It will not appear in search results</li>
                  <li>• You can republish it anytime from drafts</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            This product will remain in your drafts section until you publish it again.
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
            onClick={onDraft}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Move to Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftProductModal;