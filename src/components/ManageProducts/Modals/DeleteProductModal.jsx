import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteProductModal = ({ product, onClose, onDelete }) => (
  <>
    {/* Blurry background overlay */}
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-red-50 p-3 rounded-full flex-shrink-0">
            <AlertTriangle className="text-red-600" size={28} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Confirm Deletion</h2>
            <p className="text-gray-600">
              Are you absolutely sure you want to delete **"{product.name}"**? This action cannot be undone and will permanently remove this product from your catalog.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-6 py-3 font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
          >
            Yes, Delete Product
          </button>
        </div>
      </div>
    </div>
  </>
);

export default DeleteProductModal;