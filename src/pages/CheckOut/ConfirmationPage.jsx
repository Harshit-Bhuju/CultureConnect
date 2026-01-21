import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";
import toast from "react-hot-toast";

export default function ConfirmationPage({
  orderId,
  orderNumber,
  selectedPayment,
  selectedLocation,
  orderItem,
  navigate,
  setSelectedPayment,
  setSelectedLocation,
  sellerId,
  productId,
}) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error("Order not found");
        navigate(`/products/${sellerId}/${productId}`);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${API.GET_ORDER_DETAILS}?order_id=${orderId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (data.success) {
          setOrderDetails(data);
        } else {
          toast.error(data.error || "Failed to load order details");
          navigate(`/products/${sellerId}/${productId}`);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Network error. Please try again.");
        navigate(`/products/${sellerId}/${productId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate, sellerId, productId]);

  // Handle payment success notification
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      toast.success("Payment successful! Your order is being processed.", {
        duration: 5000,
        icon: "🎉",
      });

      params.delete("payment");
      const newUrl = params.toString()
        ? `${location.pathname}?${params.toString()}`
        : location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);
  const handleContinueShopping = () => {
    // Clear session storage
    sessionStorage.removeItem("checkout_selectedLocation");
    sessionStorage.removeItem("checkout_selectedPayment");
    sessionStorage.removeItem("checkout_orderId");
    sessionStorage.removeItem("checkout_orderNumber");
    sessionStorage.removeItem("checkout_orderDetails");

    setSelectedPayment(null);
    setSelectedLocation(null);

    navigate(`/products/${sellerId}/${productId}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  const { order, payment, delivery_location } = orderDetails;

  // Format status display
  const getStatusColor = (status) => {
    const statusColors = {
      processing: "text-blue-600",
      shipped: "text-indigo-600",
      completed: "text-green-600",
      cancelled: "text-red-600",
    };
    return statusColors[status] || "text-gray-600";
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      pending: "text-yellow-600",
      success: "text-green-600",
      failed: "text-red-600",
      refunded: "text-orange-600",
    };
    return statusColors[status] || "text-gray-600";
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white" size={48} />
          </div>

          <h1 className="text-3xl font-bold text-black mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-4">
              Order Details
            </h2>

            <div className="space-y-3 text-black">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-mono font-semibold">
                  {order.order_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status</span>
                <span
                  className={`font-medium ${getStatusColor(order.order_status)}`}>
                  {formatStatus(order.order_status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">
                  {payment.payment_method === "esewa"
                    ? "eSewa"
                    : "Cash on Delivery"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={`font-medium ${getPaymentStatusColor(payment.payment_status)}`}>
                  {formatStatus(payment.payment_status)}
                </span>
              </div>
              {payment.transaction_uuid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-xs">
                    {payment.transaction_uuid}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-4">
              Delivery Details
            </h2>

            <div className="space-y-3 text-black">
              <div>
                <p className="text-gray-600 text-sm mb-1">Delivery Address</p>
                <p className="font-medium">{delivery_location.name}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">Rs. {order.delivery_charge}</span>
              </div>
              {order.estimated_delivery_time && (
                <div>
                  <p className="text-gray-600 text-sm">Estimated Delivery</p>
                  <p className="font-medium">
                    {new Date(order.estimated_delivery_time).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Order Item</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-black">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                  {order.product_image ? (
                    <img
                      src={`${BASE_URL}/uploads/product_images/${order.product_image}`}
                      alt={order.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-700 font-medium">
                    {order.product_name}
                  </span>
                  <span className="text-gray-500 ml-2">x{order.quantity}</span>
                  {order.size && (
                    <span className="text-gray-500 ml-2">• Size: {order.size}</span>
                  )}
                  {order.store_name && (
                    <div className="flex items-center gap-2 mt-1">
                      {order.store_logo ? (
                        <img
                          src={`${BASE_URL}/uploads/seller_img_datas/seller_logos/${order.store_logo}`}
                          alt={order.store_name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-300" />
                      )}
                      <p className="text-sm text-gray-500">
                        {order.store_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <span className="font-medium">Rs. {order.subtotal}</span>
            </div>

            <div className="border-t border-gray-300 pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs. {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charge</span>
                <span>Rs. {order.delivery_charge}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Amount</span>
                <span>Rs. {order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleContinueShopping}
            className="flex-1 bg-black hover:bg-gray-800 transition-colors text-white font-semibold py-4 rounded-lg">
            Continue Shopping
          </button>
          <button
            onClick={() => toast.info("Order tracking coming soon!")}
            className="flex-1 bg-white hover:bg-gray-100 border-2 border-black transition-colors text-black font-semibold py-4 rounded-lg">
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}
