import React from "react";
import { MapPin, ChevronRight, Truck, Package, ArrowLeft } from "lucide-react";
import EditModal from "../../profileSettings_Components/EditModal";
import LocationForm from "../../profileSettings_Components/LocationForm";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";

export default function Checkout({
  orderItem,
  selectedLocation,
  setShowLocationModal,
  showLocationModal,
  handleSaveLocation,
  isLocationSaveDisabled,
  provinces,
  districts,
  municipals,
  wards,
  modalProvince,
  modalDistrict,
  modalMunicipal,
  modalWard,
  onProvinceChange,
  onDistrictChange,
  onMunicipalChange,
  onWardChange,
  subtotal,
  deliveryCharge,
  total,
  navigate,
  sellerId,
  productId,
  openLocationModal,
  incrementQuantity,
  decrementQuantity,
  updateSize,
  handleProceedToPayment,
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-0">
          {/* Left Section - Items */}
          <div className="col-span-2 p-8 border-r border-gray-200">
            <ArrowLeft
              className="text-black mb-6 cursor-pointer hover:text-gray-700"
              size={24}
              onClick={() => navigate(`/products/${sellerId}/${productId}`)}
            />
            <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>

            {/* Delivery Location */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="text-black" size={24} />
                <h2 className="text-xl font-semibold text-black">
                  Delivery Address
                </h2>
              </div>

              {!selectedLocation ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openLocationModal()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openLocationModal();
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-6 flex items-center justify-between border-2 border-dashed border-gray-300 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-600" size={24} />
                    <span className="text-gray-600 font-medium">
                      Select delivery location
                    </span>
                  </div>
                  <ChevronRight className="text-gray-600" size={24} />
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openLocationModal()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openLocationModal();
                  }}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-black mt-1" size={20} />
                      <div>
                        <p className="text-black font-medium">
                          {selectedLocation.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Delivery charges will be calculated based on this
                          location
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLocationModal();
                      }}
                      className="text-black underline text-sm hover:text-gray-700">
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-black" size={24} />
                <h2 className="text-xl font-semibold text-black">Order Item</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                    {orderItem.image ? (
                      <img
                        src={`${BASE_URL}/uploads/product_images/${orderItem.image}`}
                        alt={orderItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">
                      {orderItem.name}
                    </h3>
                    {orderItem.size && (
                      <p className="text-sm text-gray-600">
                        Size: <span className="font-medium">{orderItem.size}</span>
                      </p>
                    )}
                    {orderItem.storeName && (
                      <div className="flex items-center gap-2 mt-1">
                        {orderItem.storeLogo ? (
                          <img
                            src={`${API.BASE_URL}/uploads/seller_img_datas/seller_logos/${orderItem.storeLogo}`}
                            alt={orderItem.storeName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300" />
                        )}
                        <span className="text-xs text-gray-600">
                          {orderItem.storeName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-gray-600 text-sm">Quantity:</span>
                      <div className="flex items-center gap-2 bg-white border rounded px-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            decrementQuantity();
                          }}
                          disabled={orderItem.quantity <= 1}
                          className={`px-2 py-1 text-sm font-semibold ${orderItem.quantity <= 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-black hover:text-gray-700"
                            }`}>
                          -
                        </button>
                        <span className="text-sm font-medium px-2">
                          {orderItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            incrementQuantity();
                          }}
                          disabled={orderItem.quantity >= orderItem.stock}
                          className={`px-2 py-1 text-sm font-semibold ${orderItem.quantity >= orderItem.stock
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-black hover:text-gray-700"
                            }`}>
                          +
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({orderItem.stock} available)
                      </span>
                    </div>

                    {/* Size Selector */}
                    {orderItem.availableSizes?.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm block mb-2">
                          Size:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {orderItem.availableSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSize(size);
                              }}
                              className={`px-3 py-1.5 border-2 rounded-lg text-sm font-medium transition ${orderItem.size === size
                                  ? "border-black bg-black text-white"
                                  : "border-gray-300 hover:border-gray-400 text-gray-700"
                                }`}>
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black text-lg">
                      Rs. {orderItem.price * orderItem.quantity}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Rs. {orderItem.price} each
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Delivery charges
                are calculated live based on your selected location and distance
                from the seller.
              </p>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="bg-gray-50 p-8">
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-black">
                <span className="text-gray-700">Delivery Fee</span>
                <span
                  className={`font-medium ${!selectedLocation ? "text-gray-400" : (deliveryCharge === 0 && !orderDetails) ? "text-orange-500" : "text-green-600"}`}>
                  {!selectedLocation
                    ? "Select address"
                    : (deliveryCharge === 0 && !orderDetails)
                      ? "Calculating..."
                      : `Rs. ${deliveryCharge}`}
                </span>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between text-black">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-lg font-bold">Rs. {total}</span>
                </div>
              </div>
            </div>

            {selectedLocation && (
              <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Selected Location</p>
                <p className="text-sm text-black font-medium">
                  {selectedLocation.name}
                </p>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              disabled={!selectedLocation}
              className={`w-full font-semibold py-4 rounded-lg transition-colors mb-3 ${selectedLocation
                ? "bg-black hover:bg-gray-800 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}>
              {selectedLocation
                ? "Proceed to Payment"
                : "Select Location First"}
            </button>

            <p className="text-xs text-gray-600 text-center">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      <EditModal
        isOpen={showLocationModal}
        field="location"
        onSave={handleSaveLocation}
        onCancel={() => setShowLocationModal(false)}
        isSaveDisabled={isLocationSaveDisabled}>
        <LocationForm
          provinces={provinces}
          districts={districts}
          municipals={municipals}
          wards={wards}
          selectedProvince={modalProvince}
          selectedDistrict={modalDistrict}
          selectedMunicipal={modalMunicipal}
          selectedWard={modalWard}
          onProvinceChange={(v) => onProvinceChange(v)}
          onDistrictChange={(v) => onDistrictChange(v)}
          onMunicipalChange={(v) => onMunicipalChange(v)}
          onWardChange={(v) => onWardChange(v)}
          initialLocation={
            selectedLocation ? selectedLocation.name : "Add Location"
          }
        />
      </EditModal>
    </div>
  );
}
