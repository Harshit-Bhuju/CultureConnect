import React, { useState, useEffect } from "react";
import { Package, User, MapPin, Truck, Mail, CheckCircle, Search } from "lucide-react";
import API from "../../Configs/ApiEndpoints";
import toast from "react-hot-toast";

const CompletedDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDeliveries = async () => {
        try {
            const response = await fetch(`${API.GET_SHIPPED_ORDERS}?status=completed`, {
                credentials: "include"
            });
            const data = await response.json();
            if (data.status === "success") {
                setDeliveries(data.orders);
            } else {
                toast.error(data.message || "Failed to fetch completed deliveries");
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

    const filteredDeliveries = deliveries.filter(d =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Completed Deliveries
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        History of successfully delivered and confirmed orders
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 w-full md:w-64"
                        />
                    </div>
                    <div className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                        <CheckCircle className="w-4 h-4" /> {deliveries.length} Finished
                    </div>
                </div>
            </div>

            {filteredDeliveries.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600">{searchTerm ? "No matches found" : "No completed deliveries yet"}</h3>
                    <p className="text-slate-400">Successfully completed deliveries will appear here for your records.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDeliveries.map((delivery) => (
                        <div
                            key={delivery.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center justify-between">
                                <span className="text-sm font-bold text-green-700">
                                    {delivery.id}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full uppercase tracking-wide">
                                    <CheckCircle className="w-3 h-3" /> Confirmed
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {delivery.product}
                                    </h3>
                                    <span className="text-lg font-bold text-green-600">
                                        {delivery.price}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Buyer</p>
                                            <p className="text-sm font-semibold text-slate-700">{delivery.customer}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                                            <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{delivery.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 sm:col-span-2">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Delivered To</p>
                                            <p className="text-sm font-semibold text-slate-700">{delivery.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-green-600 font-medium text-xs italic">
                                    <span>Success! Delivery verified by customer.</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedDeliveries;
