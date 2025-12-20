import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const TopSellingChart = ({ selectedPeriod, topProducts, loading }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  console.log('📊 TopSellingChart received:', { 
    selectedPeriod, 
    topProducts, 
    loading,
    topProductsLength: topProducts?.length 
  });

  useEffect(() => {
    if (!chartRef.current || loading || !topProducts || topProducts.length === 0) {
      console.log('⏭️ Skipping chart render:', {
        hasChartRef: !!chartRef.current,
        loading,
        hasTopProducts: !!topProducts,
        topProductsLength: topProducts?.length
      });
      return;
    }

    console.log('🎨 Rendering chart with data:', topProducts);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topProducts.map(p => 
          p.status === 'deleted' 
            ? `${p.product_name} (deleted)` 
            : p.product_name
        ),
        datasets: [{
          label: selectedPeriod === "This month"
            ? "Units sold this month"
            : selectedPeriod === "This year"
              ? "Units sold this year"
              : "Total units sold",
          data: topProducts.map(p => p.units_sold),
          backgroundColor: topProducts.map(p => 
            p.status === 'deleted' ? '#9ca3af' : '#2d3748'
          ),
          borderRadius: 4,
          barThickness: 24,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a202c',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            displayColors: false,
            callbacks: {
              label: context => `${context.parsed.x} units sold`
            }
          }
        },
        scales: {
          x: { 
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          },
          y: { 
            ticks: { 
              color: '#4a5568', 
              font: { size: 12 } 
            } 
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [topProducts, selectedPeriod, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div className="flex justify-center items-center" style={{ height: '400px' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  if (!topProducts || topProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Top Selling Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedPeriod === "This month"
              ? "Units sold this month"
              : selectedPeriod === "This year"
                ? "Units sold this year"
                : "Total units sold"}
          </p>
        </div>
        <div className="flex justify-center items-center" style={{ height: '400px' }}>
          <div className="text-center">
            <p className="text-gray-500 font-medium">No sales data available</p>
            <p className="text-sm text-gray-400 mt-1">
              Start selling products to see analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dynamic height: 40px per product (minimum 400px, maximum 2000px)
  const dynamicHeight = Math.min(Math.max(topProducts.length * 40, 400), 2000);
  const isScrollable = topProducts.length > 10;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">Top Selling Products</h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedPeriod === "This month"
            ? "Units sold this month"
            : selectedPeriod === "This year"
              ? "Units sold this year"
              : "Total units sold"}
        </p>
        {isScrollable && (
          <p className="text-xs text-blue-600 mt-1">
            📊 Showing {topProducts.length} products - scroll to view all
          </p>
        )}
      </div>
      
      {/* Scrollable container */}
      <div 
        className="w-full overflow-y-auto flex-1" 
        style={{ maxHeight: '600px' }}
      >
        <div style={{ height: `${dynamicHeight}px`, minHeight: '400px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default TopSellingChart;