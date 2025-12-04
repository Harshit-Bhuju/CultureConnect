import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ManageProducts/Layout_And_Components/Header';
import StatsCards from '../../components/ManageProducts/Layout_And_Components/StatsCards';
import Filters from '../../components/ManageProducts/Filter/Filters';
import ProductGrid from '../../components/ManageProducts/ProductDisplay/ProductGrid';
import ProductList from '../../components/ManageProducts/ProductDisplay/ProductList';
import EditProductModal from '../../components/ManageProducts/modals/EditProductModal';
import DeleteProductModal from '../../components/ManageProducts/modals/DeleteProductModal';
import { initialProducts, categories, statuses, getCategoryDisplay} from '../../components/ManageProducts/Data/data';
const ProductManagement = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState(initialProducts);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Calculated stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const lowStockProducts = products.filter(p => p.stock <= 10).length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Filtered products
  const filteredProducts = products.filter(product => {
  const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = categoryFilter === 'All Categories' || 
    getCategoryDisplay(product.category) === categoryFilter;
  const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter;
  return matchesSearch && matchesCategory && matchesStatus;
});

  // Handlers
 const handleEditProduct = () => {
  setProducts(products.map(p => 
    p.id === selectedProduct.id 
      ? { 
          ...selectedProduct, 
          ...formData, 
          price: parseFloat(formData.price), 
          stock: parseInt(formData.stock),
          productName: formData.name  // Map name back to productName
        }
      : p
  ));
  setShowEditModal(false);
  resetForm();
};
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

 const openEditModal = (product) => {
  setSelectedProduct(product);
  setFormData({
    name: product.productName,  // Map productName to name
    category: product.category,
    description: product.description,
    price: product.price,
    stock: product.stock,
    status: product.status,
    image: product.images?.[0] || ''  // Use first image from images array
  });
  setShowEditModal(true);
};
  // Navigate to detail page instead of opening modal
  const handleViewProduct = (product) => {
    navigate(`/seller/products/${product.id}`);
  };

  // Navigate to edit page instead of opening modal (optional)
  const handleNavigateToEdit = (product) => {
    navigate(`/seller/products/${product.id}/edit`);
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
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categories={categories}
          statuses={statuses}
          filteredCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === 'grid' ? (
          <ProductGrid
            products={filteredProducts}
            onView={handleViewProduct}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ) : (
          <ProductList
            products={filteredProducts}
            onView={handleViewProduct}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </div>

      {/* Modals - Only Edit and Delete remain */}
      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditProduct}
        />
      )}

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