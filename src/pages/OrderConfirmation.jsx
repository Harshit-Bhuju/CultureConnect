import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../Configs/ApiEndpoints";
import toast from "react-hot-toast";
import { CheckCircle, Package, Truck, AlertCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();

    const [productName, setProductName] = useState("");
    const [loading, setLoading] = useState(true);
    const [confirmed, setConfirmed] = useState(false);
    const [reported, setReported] = useState(false);
    const [error, setError] = useState("");
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    useEffect(() => {
        // If auth is loading, wait
        if (authLoading) return;

        // Strict requirement: User must be logged in
        if (!user) {
            toast.error("Please login to confirm receipt");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`${API.CONFIRM_ORDER_DELIVERY}?order_id=${orderId}`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (data.status === "success") {
                    setProductName(data.product_name);
                    if (data.order_status === 'completed') {
                        setConfirmed(true);
                    }
                } else if (data.status === "unauthorized") {
                    setIsUnauthorized(true);
                    setError(data.message);
                } else {
                    setError(data.message || "Invalid Link");
                }
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Connection error");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, user, authLoading, navigate, location.pathname]);

    const handleAction = async (actionType) => {
        const isConfirm = actionType === 'confirm';
        const toastId = toast.loading(isConfirm ? "Updating order..." : "Submitting report...");

        try {
            const formData = new FormData();
            formData.append("order_id", orderId);
            formData.append("action", isConfirm ? 'confirm' : 'report');

            const response = await fetch(API.CONFIRM_ORDER_DELIVERY, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            const data = await response.json();

            if (data.status === "success") {
                setConfirmed(true);
                toast.success("Thank you for confirming!", { id: toastId });
            } else if (data.status === "reported") {
                setReported(true);
                toast.success("Report recorded", { id: toastId });
            } else {
                toast.error(data.message || "Action failed", { id: toastId });
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Network error", { id: toastId });
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Verifying details...</p>
            </div>
        );
    }

    if (isUnauthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-50">
                    <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
                    <p className="text-slate-500 mb-8">{error}</p>
                    <div className="flex flex-col gap-3">
                        <p className="text-xs text-slate-400 italic">Please make sure you are logged in with the email used to place this order: {user.email}</p>
                        <button onClick={() => navigate("/")} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold">Return Home</button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-50">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h1>
                    <p className="text-slate-500 mb-8">{error}</p>
                    <button onClick={() => navigate("/")} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold">Return Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-blue-50 animate-in fade-in zoom-in duration-300">
                {!confirmed && !reported ? (
                    <>
                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-4">Confirm Delivery</h1>
                        <p className="text-slate-600 mb-8">
                            Did you get your order <strong>{productName}</strong>?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleAction('confirm')}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Yes, I received it
                            </button>
                            <button
                                onClick={() => handleAction('report')}
                                className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                                No, I haven't received it
                            </button>
                        </div>
                    </>
                ) : confirmed ? (
                    <div className="animate-in fade-in slide-in-from-top-4">
                        <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Order Completed</h1>
                        <p className="text-slate-500 mb-8">
                            Thank you for confirming. Your order has been marked as finished.
                        </p>
                        <button onClick={() => navigate("/")} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold">Continue Shopping</button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-top-4 text-center">
                        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-orange-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Report Received</h1>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            It might be a mistake from our side, please patiently wait for your orders. We have notified our delivery team to investigate.
                        </p>
                        <button onClick={() => navigate("/")} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Back to Home</button>
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold tracking-tight">
                <Truck className="w-5 h-5" />
                <span>CultureConnect</span>
            </div>
        </div>
    );
};

export default OrderConfirmation;
