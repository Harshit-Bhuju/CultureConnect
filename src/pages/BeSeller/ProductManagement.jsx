import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ManageProducts/Layout_And_Components/Header';
import StatsCards from '../../components/ManageProducts/Layout_And_Components/StatsCards';
import Filters from '../../components/ManageProducts/Filter/Filters';
import ProductGrid from '../../components/ManageProducts/ProductDisplay/ProductGrid';
import ProductList from '../../components/ManageProducts/ProductDisplay/ProductList';
import DeleteProductModal from '../../components/ManageProducts/modals/DeleteProductModal';
import { initialProducts, categories, sortOptions, stockOptions, getCategoryDisplay } from '../../components/ManageProducts/Data/data';

const ProductManagement = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState(initialProducts);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortOption, setSortOption] = useState('Latest');
  const [stockFilter, setStockFilter] = useState('All Stock');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    status: 'Draft',
    image: ''
  });

  // Calculated stats (only for Active products)
  const activeProductsList = products.filter(p => p.status === 'Active');
  const totalProducts = activeProductsList.length;
  const activeProducts = activeProductsList.length;
  const lowStockProducts = activeProductsList.filter(p => p.stock <= 10).length;
  const inventoryValue = activeProductsList.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Filter and sort products (ONLY ACTIVE PRODUCTS)
  const filteredProducts = products
    .filter(product => {
      // Only show Active products
      if (product.status !== 'Active') return false;
      
      const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || 
        getCategoryDisplay(product.category) === categoryFilter;
      
      // Stock filter
      let matchesStock = true;
      if (stockFilter === 'In Stock') {
        matchesStock = product.stock > 0;
      } else if (stockFilter === 'Out of Stock') {
        matchesStock = product.stock === 0;
      }
       else if (stockFilter === 'Low Stock') {
        matchesStock = product.stock <= 10;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOption === 'Latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: 0,
      stock: 0,
      status: 'Draft',
      image: ''
    });
  };

  const handleViewProduct = (product) => {
    navigate(`/seller/products/${product.id}`);
  };

  const handleNavigateToEdit = (product) => {
    navigate(`/seller/products/edit/${product.id}`);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="px-8 py-6">
        <StatsCards
          totalProducts={totalProducts}
          activeProducts={activeProducts}
          lowStockProducts={lowStockProducts}
          inventoryValue={inventoryValue}
        />

        <Filters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          categories={categories}
          sortOptions={sortOptions}
          stockOptions={stockOptions}
          filteredCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === 'grid' ? (
          <ProductGrid
            products={filteredProducts}
            onView={handleViewProduct}
            onEdit={handleNavigateToEdit}
            onDelete={openDeleteModal}
          />
        ) : (
          <ProductList
            products={filteredProducts}
            onView={handleViewProduct}
            onEdit={handleNavigateToEdit}
            onDelete={openDeleteModal}
          />
        )}
      </div>

      {showDeleteModal && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default ProductManagement;