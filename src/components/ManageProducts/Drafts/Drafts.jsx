import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import Filters from '../Filter/Filters';
import ProductGrid from '../ProductDisplay/ProductGrid';
import ProductList from '../ProductDisplay/ProductList';
import DeleteProductModal from '../Modals/DeleteProductModal';
import PublishProductModal from '../Modals/PublishProductModal';
import API from '../../../Configs/ApiEndpoints';
import { useAuth } from '../../../context/AuthContext';

const categories = [
  'All Categories',
  'Cultural Clothes',
  'Musical Instruments',
  'Handicraft & Decors'
];

const sortOptions = ['Latest', 'Oldest'];
const stockOptions = ['All Stock', 'In Stock', 'Out of Stock', 'Low Stock'];

const getCategoryDisplay = (category) => {
  const categoryMap = {
    'cultural-clothes': 'Cultural Clothes',
    'musical-instruments': 'Musical Instruments',
    'handicraft-decors': 'Handicraft & Decors'
  };
  return categoryMap[category] || category.toUpperCase();
};

const DraftProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortOption, setSortOption] = useState('Latest');
  const [stockFilter, setStockFilter] = useState('All Stock');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Fetch draft products from backend
  useEffect(() => {
    fetchDraftProducts();
  }, []);

  const fetchDraftProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API.GET_DRAFT_PRODUCTS, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error(data.error || 'Failed to fetch draft products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching draft products:', error);
      toast.error('Failed to load draft products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort draft products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' ||
        getCategoryDisplay(product.category) === categoryFilter;

      // Stock filter
      let matchesStock = true;
      if (stockFilter === 'In Stock') {
        matchesStock = product.stock > 0;
      } else if (stockFilter === 'Out of Stock') {
        matchesStock = product.stock === 0;
      } else if (stockFilter === 'Low Stock') {
        matchesStock = product.stock > 0 && product.stock <= 10;
      }

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortOption === 'Latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const handlePublishProduct = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('product_id', selectedProduct.id);
      formData.append('status', 'published');

      const response = await fetch(API.UPDATE_PRODUCT_STATUS, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the published product from the draft list
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setShowPublishModal(false);
        setSelectedProduct(null);
        navigate(`/seller/manageproducts/${user.seller_id}`);

        toast.success('Product published successfully!', {
          duration: 3000,
          position: 'top-center',
          icon: '✅',
        });
      } else {
        toast.error(data.error || 'Failed to publish product');
      }
    } catch (error) {
      console.error('Error publishing product:', error);
      toast.error('Failed to publish product');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('product_id', selectedProduct.id);

      const response = await fetch(API.DELETE_PRODUCT, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setShowDeleteModal(false);
        setSelectedProduct(null);

        toast.success('Product deleted successfully!', {
          duration: 3000,
          position: 'top-center',
          icon: '🗑️',
        });
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleViewProduct = (product) => {
    navigate(`/seller/products/${user.seller_id}/${product.id}`);
  };

  const handleNavigateToEdit = (product) => {
    navigate(`/seller/products/edit/${user.seller_id}/${product.id}`);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const openPublishModal = (product) => {
    setSelectedProduct(product);
    setShowPublishModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading draft products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Draft Products
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your unpublished products
            </p>
          </div>
          <button
            onClick={() => navigate('/seller/manageproducts/' + user.seller_id)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Back
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-6 mb-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Total Draft Products</p>
              <p className="text-3xl font-bold mt-1">{products.length}</p>
            </div>
            <FileText className="w-12 h-12 text-gray-200 opacity-50" />
          </div>
        </div>

        {/* Filters */}
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

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Draft Products</h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? "You don't have any draft products at the moment."
                : "No products match your current filters."}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <ProductGrid
            products={filteredProducts}
            onView={handleViewProduct}
            onEdit={handleNavigateToEdit}
            onDelete={openDeleteModal}
            onPublish={openPublishModal}
            isDraftMode={true}
          />
        ) : (
          <ProductList
            products={filteredProducts}
            onView={handleViewProduct}
            onEdit={handleNavigateToEdit}
            onDelete={openDeleteModal}
            onPublish={openPublishModal}
            isDraftMode={true}
          />
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Publish Modal */}
      {showPublishModal && selectedProduct && (
        <PublishProductModal
          product={selectedProduct}
          onClose={() => setShowPublishModal(false)}
          onPublish={handlePublishProduct}
        />
      )}
    </div>
  );
};

export default DraftProducts;