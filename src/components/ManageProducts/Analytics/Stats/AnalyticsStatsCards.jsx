import React from 'react';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';
import AnalyticsStatsCard from './AnalyticsStatsCard';
 
const AnalyticsStatsCards = ({ totalRevenue, totalOrders, productsSold, avgOrderValue }) => (
        <div className="grid grid-cols-3 gap-6">
          <AnalyticsStatsCard
            icon={DollarSign}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
            label="TOTAL REVENUE"
            value={`Rs. ${totalRevenue}`}
          />
          
          <AnalyticsStatsCard
            icon={Package}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            label="PRODUCTS SOLD"
            value={productsSold}
          />
          
          <AnalyticsStatsCard
            icon={ShoppingCart}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            label="TOTAL ORDERS"
            value={totalOrders}
          />
          
        </div>
);

export default AnalyticsStatsCards;