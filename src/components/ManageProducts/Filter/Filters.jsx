import React from 'react';
import { Search, Grid, List } from 'lucide-react';

const Filters = ({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  sortOption,
  setSortOption,
  stockFilter,
  setStockFilter,
  categories,
  sortOptions,
  stockOptions,
  filteredCount,
  viewMode,
  setViewMode
}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
      
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {sortOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      
      <select
        value={stockFilter}
        onChange={(e) => setStockFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {stockOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      
      <div className="flex gap-2 ml-auto">
        <p className="text-gray-500 py-2">{filteredCount} products</p>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Grid size={20} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <List size={20} />
        </button>
      </div>
    </div>
  </div>
);

export default Filters;