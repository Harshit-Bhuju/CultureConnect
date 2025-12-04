import React from 'react';

const ProductForm = ({ formData, setFormData, categories }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
        >
          <option value="">Select category</option>
          {categories.slice(1).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
      <textarea
        placeholder="Enter product description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows="4"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
      />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
        <input
          type="number"
          min="0"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
        >
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
        </select>
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
      <input
        type="text"
        placeholder="https://example.com/image.jpg"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
      />
    </div>
  </>
);

export default ProductForm;