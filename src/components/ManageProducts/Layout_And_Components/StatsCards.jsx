import React from 'react';
import { Package, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import StatsCard from './StatsCard';

const StatsCards = ({ totalProducts, activeProducts, lowStockProducts, inventoryValue }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatsCard
      icon={Package}
      iconBgColor="bg-orange-100"
      iconColor="text-orange-500"
      label="Total Products"
      value={totalProducts}
    />
    <StatsCard
      icon={TrendingUp}
      iconBgColor="bg-green-100"
      iconColor="text-green-500"
      label="Active Products"
      value={activeProducts}
    />
    <StatsCard
      icon={AlertCircle}
      iconBgColor="bg-yellow-100"
      iconColor="text-yellow-500"
      label="Low Stock"
      value={lowStockProducts}
    />
    <StatsCard
      icon={DollarSign}
      iconBgColor="bg-orange-100"
      iconColor="text-orange-500"
      label="Inventory Value"
      value={`Rs.${inventoryValue.toLocaleString()}`}
    />
  </div>
);

export default StatsCards;