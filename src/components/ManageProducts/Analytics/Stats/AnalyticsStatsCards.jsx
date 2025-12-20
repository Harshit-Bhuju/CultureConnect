import React from 'react';
import { Package, ShoppingCart, DollarSign, Box, FileText, Trash2, Grid } from 'lucide-react';
import AnalyticsStatsCard from './AnalyticsStatsCard';
 
const AnalyticsStatsCards = ({ totalRevenue, totalOrders, productsSold, productStats }) => (
  <>
    {/* Sales Performance Stats */}
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

    {/* Product Inventory Stats */}
    <div className="grid grid-cols-4 gap-6 mt-6">
      <AnalyticsStatsCard
        icon={Grid}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        label="TOTAL PRODUCTS"
        value={productStats.total_products}
      />
      
      <AnalyticsStatsCard
        icon={Box}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="ACTIVE PRODUCTS"
        value={productStats.active_products}
      />
      
      <AnalyticsStatsCard
        icon={FileText}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        label="DRAFT PRODUCTS"
        value={productStats.draft_products}
      />
      
      <AnalyticsStatsCard
        icon={Trash2}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
        label="DELETED PRODUCTS"
        value={productStats.deleted_products}
      />
    </div>
  </>
);

export default AnalyticsStatsCards;