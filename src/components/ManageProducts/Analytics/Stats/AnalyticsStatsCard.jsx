import React from 'react';
const AnalyticsStatsCard = ({ icon: Icon, iconBgColor, iconColor, label, value, change }) => (
  <div className="bg-white rounded-xl px-4 py-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-start gap-6 p-2">
       <div className={`${iconBgColor} p-3 rounded-lg`}>
        <Icon className={iconColor} size={24} />
      </div>
      <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      
    </div>
     
    </div>
    
  </div>
);
export default AnalyticsStatsCard