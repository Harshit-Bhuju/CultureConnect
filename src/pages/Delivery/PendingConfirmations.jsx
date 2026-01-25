import React, { useState, useEffect } from "react";
import { Package, Smartphone, User, MapPin, Tag, Truck, Mail, Info, Clock, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react";
import API from "../../Configs/ApiEndpoints";
import toast from "react-hot-toast";

const PendingConfirmations = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDeliveries = async () => {
        try {
            // Fetch only orders with 'delivered_pending' status
            const response = await fetch(`${API.GET_SHIPPED_ORDERS}?status=delivered_pending`, {
                credentials: "include"
            });
            const data = await response.json();
            if (data.status === "success") {
                setDeliveries(data.orders);
            } else {
                toast.error(data.message || "Failed to fetch pending confirmations");
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
        // Poll for updates every 10 seconds to auto-remove completed items
        const interval = setInterval(fetchDeliveries, 10000);
        return () => clearInterval(interval);
    }, []);

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
                        Pending Confirmation
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Orders delivered but awaiting buyer confirmation
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {deliveries.length} Pending
                    </div>
                </div>
            </div>

            {/* Instruction Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Info className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">Instruction for Delivery Boy</h4>
                    <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                        Please ask the buyer to check their email (<strong>{deliveries.length > 0 ? "Look for 'Delivery Confirmation'" : "customer's email"}</strong>) and click the "Confirm Receipt" button.
                        Once they confirm, the order will be marked as completed and will disappear from this list.
                    </p>
                </div>
            </div>

            {deliveries.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600">All caught up!</h3>
                    <p className="text-slate-400">There are no orders awaiting confirmation right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {deliveries.map((delivery) => (
                        <div
                            key={delivery.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow opacity-90">
                            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                                <span className="text-sm font-bold text-amber-700">
                                    {delivery.id}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full uppercase tracking-wide">
                                    <Clock className="w-3 h-3" /> Awaiting Buyer
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
                                                Email to Confirm
                                            </p>
                                            <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">
                                                {delivery.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 sm:col-span-2">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                Delivery Address
                                            </p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {delivery.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 space-y-4">
                                    {delivery.has_report ? (
                                        <button
                                            disabled
                                            className="w-full py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80">
                                            <AlertTriangle className="w-3 h-3" /> Resolve Discrepancy First
                                        </button>
                                    ) : (
                                        <button
                                            onClick={async () => {
                                                const toastId = toast.loading("Resending link...");
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("order_id", delivery.order_id);
                                                    const res = await fetch(API.DELIVERY_SUCCESS_EMAIL, {
                                                        method: "POST",
                                                        body: formData,
                                                        credentials: "include"
                                                    });
                                                    const data = await res.json();
                                                    if (data.status === "success") {
                                                        toast.success("Link resent successfully!", { id: toastId });
                                                    } else {
                                                        toast.error(data.message || "Failed to resend link", { id: toastId });
                                                    }
                                                } catch (err) {
                                                    toast.error("Network error", { id: toastId });
                                                }
                                            }}
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                            <RefreshCw className="w-3 h-3" /> Resend Confirmation Link
                                        </button>
                                    )}
                                    <div className="flex items-center gap-2 text-amber-600">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-bold italic">Waiting for customer to click the email link...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingConfirmations;
