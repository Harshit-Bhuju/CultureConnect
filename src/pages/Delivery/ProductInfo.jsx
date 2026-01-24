import React from "react";
import { Package, Smartphone, User, MapPin, Tag, Truck } from "lucide-react";

const ProductInfo = () => {
  // Mock delivery list
  const deliveries = [
    {
      id: "#ORD-9921",
      customer: "Arjun Rai",
      product: "Handcrafted Madal",
      phone: "+977 9841234567",
      address: "Lalitpur - 12, Gwarko",
      status: "In Transit",
      price: "Rs. 2,500",
      items: "1x Large Madal, 1x Tuning Key",
      estimatedTime: "25 mins",
    },
    {
      id: "#ORD-9925",
      customer: "Sita Sharma",
      product: "Traditional Dhaka Topi",
      phone: "+977 9801234568",
      address: "Bhaktapur - 5, Suryabinayak",
      status: "In Transit",
      price: "Rs. 850",
      items: "2x Palpali Dhaka Topi (Size M)",
      estimatedTime: "1 hour",
    },
    {
      id: "#ORD-9930",
      customer: "Rahul Gurung",
      product: "Bronze Khukuri Set",
      phone: "+977 9812345679",
      address: "Kathmandu - 3, Maharajgunj",
      status: "Assigned",
      price: "Rs. 5,200",
      items: "1x 12-inch Khukuri, 1x Safety Sheath",
      estimatedTime: "Scheduled",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Product Information
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Details about your current deliveries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2">
            <Package className="w-4 h-4" /> {deliveries.length} Deliveries
            Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">
                {delivery.id}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wide">
                <Truck className="w-3 h-3" /> {delivery.status}
              </span>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  {delivery.product}
                </h3>
                <span className="text-lg font-bold text-blue-600">
                  {delivery.price}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Customer
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {delivery.customer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Contact
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {delivery.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Items Ordered
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {delivery.items}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {delivery.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.address)}`,
                      "_blank",
                    )
                  }
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-100">
                  <MapPin className="w-4 h-4" /> Navigate
                </button>
                <button className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <Truck className="w-4 h-4" /> Update Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
