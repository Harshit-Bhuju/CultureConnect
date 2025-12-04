import React from 'react';

const StatsCard = ({ icon: Icon, iconBgColor, iconColor, label, value }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center gap-4">
      <div className={`${iconBgColor} p-3 rounded-lg`}>
        <Icon className={iconColor} size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default StatsCard;