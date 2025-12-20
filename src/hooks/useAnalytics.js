import { useState, useEffect } from 'react';
import API from '../Configs/ApiEndpoints';

const useAnalytics = (selectedPeriod) => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    products_sold: 0,
    total_orders: 0,
    avg_order_value: 0
  });
  const [productStats, setProductStats] = useState({
    active_products: 0,
    draft_products: 0,
    deleted_products: 0,
    total_products: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching analytics for period:', selectedPeriod);

        // Fetch analytics stats
        const statsUrl = `${API.GET_ANALYTICS_STATS}?period=${encodeURIComponent(selectedPeriod)}`;
        console.log('📊 Stats URL:', statsUrl);
        
        const statsResponse = await fetch(statsUrl, {
          method: 'GET',
          credentials: 'include',
        });

        console.log('📊 Stats Response Status:', statsResponse.status);

        if (!statsResponse.ok) {
          throw new Error(`Stats API error: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        console.log('✅ Stats data received:', statsData);
        
        if (!statsData.success) {
          throw new Error(statsData.error || 'Failed to load analytics');
        }

        setStats(statsData.stats);
        setProductStats(statsData.product_stats);

        // Fetch top selling products
        const productsUrl = `${API.GET_TOP_SELLING_PRODUCTS}?period=${encodeURIComponent(selectedPeriod)}`;
        console.log('📈 Products URL:', productsUrl);
        
        const productsResponse = await fetch(productsUrl, {
          method: 'GET',
          credentials: 'include',
        });

        console.log('📈 Products Response Status:', productsResponse.status);

        if (!productsResponse.ok) {
          throw new Error(`Products API error: ${productsResponse.status}`);
        }

        const productsData = await productsResponse.json();
        console.log('✅ Products data received:', productsData);
        
        if (!productsData.success) {
          throw new Error(productsData.error || 'Failed to load top products');
        }

        console.log('🎯 Setting topProducts to:', productsData.top_products);
        setTopProducts(productsData.top_products || []);

      } catch (err) {
        console.error('❌ Analytics fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('✅ Loading finished');
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  return { stats, productStats, topProducts, loading, error };
};

export default useAnalytics;