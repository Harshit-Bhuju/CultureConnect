import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/ManageProducts/Layout_And_Components/Header';
import StatsCards from '../../components/ManageProducts/Layout_And_Components/StatsCards';
import Filters from '../../components/ManageProducts/Filter/Filters';
import ProductGrid from '../../components/ManageProducts/ProductDisplay/ProductGrid';
import ProductList from '../../components/ManageProducts/ProductDisplay/ProductList';
import DeleteProductModal from '../../components/ManageProducts/modals/DeleteProductModal';
import { categories, sortOptions, getCategoryDisplay } from '../../components/ManageProducts/Data/data';
import API from '../../Configs/ApiEndpoints';
import Loading from '../../components/Common/Loading';


const ProductManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortOption, setSortOption] = useState('Latest');
  const [stockFilter, setStockFilter] = useState('All Stock');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    inventoryValue: 0
  });
 const stockOptions = ['All Stock', 'In Stock','Low Stock'];
  // Fetch products from backend
  useEffect(() => {
    if (!user?.seller_id) {
      setError('No seller account found');
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [user?.seller_id]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API.GET_SELLER_PRODUCTS, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
        setStats(data.stats || {
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0,
          inventoryValue: 0
        });
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Network error while fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products (ONLY ACTIVE PRODUCTS)
  const filteredProducts = products
    .filter(product => {
      // Only show Active products (status === 'Active' or 'Published')
      if (product.status !== 'Active' && product.status !== 'Published') return false;
      
      const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || 
        getCategoryDisplay(product.category) === categoryFilter;
      
      // Stock filter
      let matchesStock = true;
      if (stockFilter === 'In Stock') {
        matchesStock = product.stock > 0;
      } else if (stockFilter === 'Low Stock') {
        matchesStock = product.stock <= 10;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortOption === 'Latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      else if (sortOption === 'Recently Updated') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return 0;
    });

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

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
        // Refresh products list
        await fetchProducts();
        setShowDeleteModal(false);
        setSelectedProduct(null);
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Network error while deleting product');
    }
  };

  const handleViewProduct = (product) => {
    if (!user?.seller_id) return;
    navigate(`/seller/products/${user?.seller_id}/${product.id}`);
  };

  const handleNavigateToEdit = (product) => {
    if (!user?.seller_id) return;
    navigate(`/seller/products/edit/${user?.seller_id}/${product.id}`);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="px-8 py-6">
        <StatsCards
          totalProducts={stats.totalProducts}
          activeProducts={stats.activeProducts}
          lowStockProducts={stats.lowStockProducts}
          inventoryValue={stats.inventoryValue}
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