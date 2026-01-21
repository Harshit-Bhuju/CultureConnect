import React from "react";
import { Check, ArrowLeft, Truck } from "lucide-react";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";

export default function PaymentPage({
  setSelectedPayment,
  selectedPayment,
  orderDetails,
  selectedLocation,
  navigate,
  sellerId,
  productId,
  orderItem,
  handleConfirmPayment,
}) {
  // Show loading if order details not available
  if (!orderDetails || !orderDetails.order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const { order } = orderDetails;
  const subtotal = order.subtotal;
  const deliveryCharge = order.delivery_charge;
  const total = order.total_amount;
  const estimatedDelivery = order.estimated_delivery_time;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-0">
          {/* Left Section - Payment Options */}
          <div className="col-span-2 p-8 border-r border-gray-200">
            <ArrowLeft
              className="text-black mb-6 cursor-pointer hover:text-gray-700"
              size={24}
              onClick={() => navigate(`/checkout/${sellerId}/${productId}`)}
            />
            <h1 className="text-3xl font-bold text-black mb-8">
              Payment Method
            </h1>

            <div className="space-y-4">
              {/* eSewa */}
              <button
                onClick={() => setSelectedPayment("esewa")}
                className={`w-full p-6 rounded-lg border-2 transition-all ${
                  selectedPayment === "esewa"
                    ? "border-black bg-gray-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">eSewa</span>
                    </div>
                    <div className="text-left">
                      <span className="text-black font-semibold text-lg block">
                        eSewa
                      </span>
                      <span className="text-gray-600 text-sm">
                        Pay securely with eSewa wallet
                      </span>
                    </div>
                  </div>
                  {selectedPayment === "esewa" && (
                    <Check className="text-black" size={28} />
                  )}
                </div>
              </button>

              {/* Cash on Delivery */}
              <button
                onClick={() => setSelectedPayment("cod")}
                className={`w-full p-6 rounded-lg border-2 transition-all ${
                  selectedPayment === "cod"
                    ? "border-black bg-gray-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-2xl">💵</span>
                    </div>
                    <div className="text-left">
                      <span className="text-black font-semibold text-lg block">
                        Cash on Delivery
                      </span>
                      <span className="text-gray-600 text-sm">
                        Pay when you receive the order
                      </span>
                    </div>
                  </div>
                  {selectedPayment === "cod" && (
                    <Check className="text-black" size={28} />
                  )}
                </div>
              </button>
            </div>

            {/* Important Note */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Your order has been
                created and reserved. Please complete payment to confirm your
                order.
              </p>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="bg-gray-50 p-8">
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {/* Order Number */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Order Number</p>
                <p className="font-mono font-semibold text-sm">
                  {order.order_number}
                </p>
              </div>

              {/* Product Info */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {order.product_image ? (
                      <img
                        src={`${API.PRODUCT_IMAGES}/${order.product_image}`}
                        alt={order.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{order.product_name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {order.quantity}
                    </p>
                    {order.size && (
                      <p className="text-xs text-gray-500">
                        Size: {order.size}
                      </p>
                    )}
                    {order.store_name && (
                      <div className="flex items-center gap-1 mt-1">
                        {order.store_logo ? (
                          <img
                            src={`${BASE_URL}/uploads/seller_img_datas/seller_logos/${order.store_logo}`}
                            alt={order.store_name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-300" />
                        )}
                        <span className="text-xs text-gray-500">
                          {order.store_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-black">
                  <span className="text-gray-700">
                    Subtotal ({order.quantity} item
                    {order.quantity > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium">Rs. {subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-black">
                  <span className="text-gray-700">Delivery Charge</span>
                  <span className="font-medium">Rs. {deliveryCharge}</span>
                </div>

                {order.delivery_distance_km > 0 && (
                  <p className="text-xs text-gray-500">
                    Distance: {order.delivery_distance_km} km
                  </p>
                )}

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-black">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-lg font-bold">Rs. {total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="text-black" size={18} />
                  <span className="font-semibold text-sm">
                    Estimated Delivery
                  </span>
                </div>
                <p className="text-sm text-black font-medium">
                  {estimatedDelivery
                    ? new Date(estimatedDelivery).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Calculating..."}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Delivering to:</p>
                  <p className="text-xs text-black">{selectedLocation?.name}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={!selectedPayment}
              className={`w-full font-semibold py-4 rounded-lg transition-colors mb-3 ${
                selectedPayment
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}>
              {selectedPayment
                ? `Confirm & Pay Rs. ${total}`
                : "Select Payment Method"}
            </button>

            <button
              onClick={() => navigate(`/checkout/${sellerId}/${productId}`)}
              className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-black py-3 rounded-lg transition-colors font-medium">
              Back to Checkout
            </button>

            <p className="text-xs text-gray-600 text-center mt-3">
              Order will be automatically cancelled if not paid within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
