import React, { useState, useEffect } from "react";
import { Package, Smartphone, User, MapPin, Tag, Truck, Mail, CheckCircle } from "lucide-react";
import API from "../../Configs/ApiEndpoints";
import toast from "react-hot-toast";

const ProductInfo = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch(API.GET_SHIPPED_ORDERS, {
        credentials: "include"
      });
      const data = await response.json();
      if (data.status === "success") {
        setDeliveries(data.orders);
      } else {
        toast.error(data.message || "Failed to fetch shipments");
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleDeliverySuccess = async (orderId) => {
    const toastId = toast.loading("Sending confirmation email...");
    try {
      const formData = new FormData();
      formData.append("order_id", orderId);

      const response = await fetch(API.DELIVERY_SUCCESS_EMAIL, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      const data = await response.json();

      if (data.status === "success") {
        toast.success(data.message, { id: toastId });
        // Refresh list
        fetchDeliveries();
        if (data.demo_link) {
          console.log("Demo Confirmation Link:", data.demo_link);
        }
      } else {
        toast.error(data.message || "Failed to send email", { id: toastId });
      }
    } catch (error) {
      console.error("Error triggering success:", error);
      toast.error("Error contacting server", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Shipments info
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Details about shipped orders awaiting delivery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2">
            <Package className="w-4 h-4" /> {deliveries.length} Shipments
            Found
          </div>
        </div>
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-600">No shipped orders at the moment</h3>
          <p className="text-slate-400">All orders are either being processed or have been completed.</p>
        </div>
      ) : (
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
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Contact Email
                      </p>
                      <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">
                        {delivery.email}
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
                  <button
                    onClick={() => handleDeliverySuccess(delivery.order_id)}
                    className="flex-1 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                    <CheckCircle className="w-4 h-4 text-green-400" /> Delivery Successful
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
