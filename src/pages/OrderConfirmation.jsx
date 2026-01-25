import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../Configs/ApiEndpoints";
import toast from "react-hot-toast";
import { CheckCircle, Package, Truck, AlertCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "../components/Common/ConfirmationModal";

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading, logout } = useAuth();

    const [productName, setProductName] = useState("");
    const [loading, setLoading] = useState(true);
    const [confirmed, setConfirmed] = useState(false);
    const [reported, setReported] = useState(false);
    const [error, setError] = useState("");
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [alreadyReported, setAlreadyReported] = useState(false);
    const [authMethod, setAuthMethod] = useState("");
    const [navigatingHome, setNavigatingHome] = useState(false);
    const [justActioned, setJustActioned] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        actionType: "",
        isDestructive: false
    });

    // Get token from URL
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");

    // ... (useEffect remains same as before)
    useEffect(() => {
        if (authLoading) return;

        // Redirect to login ONLY if no token and no user
        if (!user && !urlToken) {
            toast.error("Please login to confirm receipt");
            navigate("/login", { state: { from: location.pathname + location.search } });
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const tokenParam = urlToken ? `&token=${urlToken}` : "";
                const response = await fetch(`${API.CONFIRM_ORDER_DELIVERY}?order_id=${orderId}${tokenParam}`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (data.status === "success") {
                    setProductName(data.product_name);
                    setAuthMethod(data.auth_method);
                    if (data.order_status === 'completed') {
                        setConfirmed(true);
                    }
                } else if (data.status === "already_done") {
                    setConfirmed(true);
                    setProductName(data.product_name || "your order");
                } else if (data.status === "already_reported") {
                    setReported(true);
                    setAlreadyReported(true);
                    setProductName(data.product_name || "your order");
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
    }, [orderId, user, authLoading, navigate, location.pathname, location.search, urlToken]);

    const initiateAction = (actionType) => {
        const isConfirm = actionType === 'confirm';
        setModalConfig({
            title: isConfirm ? "Confirm Receipt" : "Report Issue",
            message: isConfirm
                ? "Are you sure you have received your order? This will complete the delivery process."
                : "Are you sure you haven't received your order? This will notify our delivery team to investigate.",
            actionType: actionType,
            isDestructive: !isConfirm
        });
        setModalOpen(true);
    };

    const handleConfirmAction = async () => {
        setModalOpen(false);
        const actionType = modalConfig.actionType;
        const isConfirm = actionType === 'confirm';

        const toastId = toast.loading(isConfirm ? "Updating order..." : "Submitting report...");

        try {
            const formData = new FormData();
            formData.append("order_id", orderId);
            formData.append("action", isConfirm ? 'confirm' : 'report');
            if (urlToken) {
                formData.append("token", urlToken);
            }

            const response = await fetch(API.CONFIRM_ORDER_DELIVERY, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            const data = await response.json();

            if (data.status === "success") {
                setConfirmed(true);
                setJustActioned(true);
                toast.success("Thank you for confirming!", { id: toastId });
            } else if (data.status === "reported") {
                setReported(true);
                setJustActioned(true);
                toast.success("Report recorded", { id: toastId });
            } else if (data.status === "already_done") {
                setConfirmed(true);
                toast.error("This order was already confirmed", { id: toastId });
            } else if (data.status === "already_reported") {
                setReported(true);
                setAlreadyReported(true);
                toast.error("You already reported this delivery", { id: toastId });
            } else {
                toast.error(data.message || "Action failed", { id: toastId });
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Network error", { id: toastId });
        }
    };

    const goHome = () => {
        setNavigatingHome(true);
        setTimeout(() => {
            navigate("/");
        }, 800); // Small delay to show the "WOW" design loader
    };

    if (authLoading || loading || navigatingHome) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center animate-in fade-in duration-500">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Truck className="w-8 h-8 text-blue-600 animate-bounce" />
                    </div>
                </div>
                <h2 className="mt-8 text-2xl font-black text-slate-800 tracking-tight">
                    {navigatingHome ? "Taking you home..." : "Verifying details..."}
                </h2>
                <p className="mt-2 text-slate-400 font-medium">CultureConnect Delivery System</p>
            </div>
        );
    }

    if (isUnauthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-50">
                    <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
                    <div className="text-slate-500 mb-8" dangerouslySetInnerHTML={{ __html: error }} />
                    <div className="flex flex-col gap-3">
                        {user ? (
                            <button
                                onClick={async () => {
                                    await logout();
                                    navigate("/login", { state: { from: location.pathname + location.search } });
                                }}
                                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-colors">
                                Logout & Switch Account
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/login", { state: { from: location.pathname + location.search } })}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors">
                                Login to Continue
                            </button>
                        )}
                        <button onClick={goHome} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Return Home</button>
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
                    <button onClick={goHome} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold">Return Home</button>
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
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Did you get your order <strong>{productName}</strong>?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => initiateAction('confirm')}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Yes, I received it
                            </button>
                            <button
                                onClick={() => initiateAction('report')}
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
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            {(authMethod === 'token' && !justActioned) ? "Link Expired" : "Order Completed"}
                        </h1>
                        <p className="text-slate-500 mb-8">
                            {(authMethod === 'token' && !justActioned)
                                ? "This order has already been confirmed as delivered. The link is no longer active."
                                : "Thank you for confirming. Your order has been marked as finished."}
                        </p>
                        <button onClick={goHome} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold">Continue Shopping</button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-top-4 text-center">
                        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-orange-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            {(alreadyReported && !justActioned) ? "Link Expired" : "Report Received"}
                        </h1>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            {(alreadyReported && !justActioned)
                                ? "You have already reported an issue with this delivery. The link is no longer active."
                                : "It might be a mistake from our side, please patiently wait for your orders. We have notified our delivery team to investigate."}
                        </p>
                        <button onClick={goHome} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Back to Home</button>
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold tracking-tight">
                <Truck className="w-5 h-5" />
                <span>CultureConnect</span>
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmAction}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.isDestructive ? "Yes, Report Issue" : "Yes, Confirm Receipt"}
                isDestructive={modalConfig.isDestructive}
            />
        </div>
    );
};

export default OrderConfirmation;
