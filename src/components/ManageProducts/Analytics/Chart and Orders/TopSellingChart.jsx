import React, { useEffect, useRef, useMemo } from 'react';
import { Chart } from 'chart.js/auto';
import { initialProducts } from '../../Data/data';

const TopSellingChart = ({ selectedPeriod }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const topProducts = useMemo(() => {
    const key = selectedPeriod === "This month"
      ? "thisMonth"
      : selectedPeriod === "This year"
        ? "thisYear"
        : "totalSales";

    return [...initialProducts]
      .sort((a, b) => b.sales[0][key] - a.sales[0][key])
      .slice(0, 6);
  }, [selectedPeriod]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topProducts.map(p => p.productName),
        datasets: [{
          label: selectedPeriod === "This month"
            ? "Units sold this month"
            : selectedPeriod === "This year"
              ? "Units sold this year"
              : "Total units sold",
          data: topProducts.map(p => {
            if (selectedPeriod === "This month") return p.sales[0].thisMonth;
            if (selectedPeriod === "This year") return p.sales[0].thisYear;
            return p.sales[0].totalSales;
          }),
          backgroundColor: '#2d3748',
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
          x: { beginAtZero: true },
          y: { ticks: { color: '#4a5568', font: { size: 12 } } }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [topProducts, selectedPeriod]);

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
      <div className="w-full" style={{ height: '400px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TopSellingChart;
