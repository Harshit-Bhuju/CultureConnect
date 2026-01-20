// CheckOutPage.jsx - Fixed double toast
import React, { useState, useEffect, useRef } from 'react';
import useNepalAddress from "../../hooks/NepalAddress";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Checkout from './Checkout';
import PaymentPage from './PaymentPage';
import ConfirmationPage from './ConfirmationPage';
import API from '../../Configs/ApiEndpoints';
import toast from 'react-hot-toast';

export default function CheckOutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  const searchParams = new URLSearchParams(location.search);
  const initialQty = parseInt(searchParams.get('qty'), 10) || 1;

  const { sellerId, productId } = useParams();

  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const raw = sessionStorage.getItem('checkout_selectedLocation');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [selectedPayment, setSelectedPayment] = useState(() => {
    try {
      const v = sessionStorage.getItem('checkout_selectedPayment');
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [orderId, setOrderId] = useState(() => {
    try {
      const saved = sessionStorage.getItem('checkout_orderId');
      return saved || null;
    } catch (e) {
      return null;
    }
  });

  const [orderNumber, setOrderNumber] = useState(() => {
    try {
      const saved = sessionStorage.getItem('checkout_orderNumber');
      return saved || null;
    } catch (e) {
      return null;
    }
  });

  const [orderDetails, setOrderDetails] = useState(() => {
    try {
      const saved = sessionStorage.getItem('checkout_orderDetails');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [modalProvince, setModalProvince] = useState('');
  const [modalDistrict, setModalDistrict] = useState('');
  const [modalMunicipal, setModalMunicipal] = useState('');
  const [modalWard, setModalWard] = useState('');

  const [productInfo, setProductInfo] = useState(null);
  const [orderItem, setOrderItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    provinces,
    districts,
    municipals,
    wards,
    setSelectedProvince: setHookSelectedProvince,
    setSelectedDistrict: setHookSelectedDistrict,
    setSelectedMunicipal: setHookSelectedMunicipal,
    setSelectedWard: setHookSelectedWard,
  } = useNepalAddress();

  const path = location.pathname || '/checkout';
  const currentStep = path.includes('payment') ? 'payment'
    : path.includes('confirmation') ? 'confirmation'
      : 'checkout';

  // Removed strict redirection to allow direct access to checkout URL
  useEffect(() => {
    // If we're missing crucial params, redirect back
    if (!sellerId || !productId) {
      toast.error('Invalid checkout session');
      navigate('/', { replace: true });
    }
  }, [sellerId, productId, navigate]);



  useEffect(() => {
    if (hasRedirected.current) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API.GET_USER_LOCATION}?product_id=${productId}&quantity=${initialQty}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (data.success) {
          setProductInfo(data.product);

          setOrderItem({
            id: data.product.id,
            name: data.product.name,
            price: data.product.price,
            quantity: initialQty,
            image: data.product.product_image,
            stock: data.product.stock
          });

          if (data.hasLocation && data.location && !selectedLocation) {
            setSelectedLocation(data.location);
          }
        } else {
          toast.error(data.error || 'Failed to load product');
          navigate(`/products/${sellerId}/${productId}`);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Network error. Please try again.');
        navigate(`/products/${sellerId}/${productId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [productId, navigate, sellerId]);

  const validateQuantity = async (newQuantity) => {
    try {
      const response = await fetch(
        `${API.GET_USER_LOCATION}?product_id=${productId}&quantity=${newQuantity}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || 'Insufficient stock');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating quantity:', error);
      toast.error('Error validating quantity');
      return false;
    }
  };

  const incrementQuantity = async () => {
    const newQuantity = orderItem.quantity + 1;
    const isValid = await validateQuantity(newQuantity);

    if (isValid) {
      setOrderItem(prev => ({ ...prev, quantity: newQuantity }));
      setTimeout(() => handleProceedToPayment(true), 100);
    }
  };

  const decrementQuantity = () => {
    if (orderItem.quantity > 1) {
      setOrderItem(prev => ({
        ...prev,
        quantity: prev.quantity - 1
      }));
      setTimeout(() => handleProceedToPayment(true), 100);
    }
  };

  const subtotal = orderItem ? orderItem.price * orderItem.quantity : 0;
  const delivery = orderDetails?.order?.delivery_charge || 0;
  const total = subtotal + delivery;

  const isLocationSaveDisabled = () => {
    return !modalProvince || !modalDistrict || !modalMunicipal || !modalWard;
  };

  const handleSaveLocation = async () => {
    const name = `${modalProvince}, ${modalDistrict}, ${modalMunicipal}, ${modalWard}`;
    const locationData = {
      name,
      province: modalProvince,
      district: modalDistrict,
      municipality: modalMunicipal,
      ward: modalWard
    };

    setSelectedLocation(locationData);
    setShowLocationModal(false);

    // Reset local modal state
    setModalProvince('');
    setModalDistrict('');
    setModalMunicipal('');
    setModalWard('');
    setHookSelectedProvince('');
    setHookSelectedDistrict('');
    setHookSelectedMunicipal('');
    setHookSelectedWard('');

    // Trigger order update to get new delivery charge
    // We pass true for silent mode to avoid navigation
    setTimeout(() => {
      handleProceedToPayment(true);
    }, 100);
  };

  const handleProvinceChange = (v) => {
    setModalProvince(v);
    setModalDistrict('');
    setModalMunicipal('');
    setModalWard('');
    setHookSelectedProvince(v);
  };

  const handleDistrictChange = (v) => {
    setModalDistrict(v);
    setModalMunicipal('');
    setModalWard('');
    setHookSelectedDistrict(v);
  };

  const handleMunicipalChange = (v) => {
    setModalMunicipal(v);
    setModalWard('');
    setHookSelectedMunicipal(v);
  };

  const handleWardChange = (v) => {
    setModalWard(v);
    setHookSelectedWard(v);
  };

  const openLocationModal = () => {
    if (selectedLocation?.name) {
      const parts = selectedLocation.name.split(',').map(p => p.trim());
      const [prov = '', dist = '', muni = '', ward = ''] = parts;
      setModalProvince(prov);
      setModalDistrict(dist);
      setModalMunicipal(muni);
      setModalWard(ward);
      setHookSelectedProvince(prov);
      setHookSelectedDistrict(dist);
      setHookSelectedMunicipal(muni);
      setHookSelectedWard(ward);
    } else {
      setModalProvince('');
      setModalDistrict('');
      setModalMunicipal('');
      setModalWard('');
      setHookSelectedProvince('');
      setHookSelectedDistrict('');
      setHookSelectedMunicipal('');
      setHookSelectedWard('');
    }
    setShowLocationModal(true);
  };

  const handleProceedToPayment = async (silent = false) => {
    if (!selectedLocation) {
      if (!silent) toast.error('Please select a delivery location');
      return;
    }

    try {
      if (silent) toast('Calculating delivery fees...');

      const formData = new FormData();
      formData.append('seller_id', sellerId);
      formData.append('product_id', productId);
      formData.append('quantity', orderItem.quantity);
      formData.append('delivery_province', selectedLocation.province);
      formData.append('delivery_district', selectedLocation.district);
      formData.append('delivery_municipality', selectedLocation.municipality);
      formData.append('delivery_ward', selectedLocation.ward);

      const response = await fetch(API.CREATE_ORDER, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setOrderDetails(data);
        setOrderId(data.order.id);
        setOrderNumber(data.order.order_number);
        sessionStorage.setItem('checkout_orderId', data.order.id);
        sessionStorage.setItem('checkout_orderNumber', data.order.order_number);
        sessionStorage.setItem('checkout_orderDetails', JSON.stringify(data));

        if (!silent) {
          toast.success('Order created! Proceed to payment');
          navigate(`/checkout/payment/${sellerId}/${productId}`, {
            state: { fromCheckout: true }
          });
        } else {
          toast.success('Delivery fees updated!');
        }
      } else {
        toast.error(data.error || 'Failed to create order');

        if (data.availableStock !== undefined) {
          setOrderItem(prev => ({
            ...prev,
            stock: data.availableStock,
            quantity: Math.min(prev.quantity, data.availableStock)
          }));
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    if (!orderId) {
      toast.error('Order not found');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('order_id', orderId);
      formData.append('payment_method', selectedPayment);
      formData.append('frontend_url', window.location.origin);

      const response = await fetch(API.CONFIRM_PAYMENT, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('text/html')) {
        const html = await response.text();

        toast('Redirecting to eSewa payment gateway...');
        const formContainer = document.createElement('div');
        formContainer.style.display = 'none';
        formContainer.innerHTML = html;
        document.body.appendChild(formContainer);

        setTimeout(() => {
          const form = formContainer.querySelector('form');
          if (form) {
            form.submit();
          } else {
            toast.error('Payment form error. Please try again.');
          }
        }, 100);

        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Payment confirmed!');
        navigate(`/checkout/confirmation/${sellerId}/${productId}`, {
          state: { fromPayment: true }
        });
      } else {
        toast.error(data.error || 'Failed to confirm payment');

        if (data.availableStock !== undefined) {
          setOrderItem(prev => ({
            ...prev,
            stock: data.availableStock,
            quantity: Math.min(prev.quantity, data.availableStock)
          }));
          setOrderId(null);
          setOrderNumber(null);
          setOrderDetails(null);
          sessionStorage.removeItem('checkout_orderId');
          sessionStorage.removeItem('checkout_orderNumber');
          sessionStorage.removeItem('checkout_orderDetails');
          navigate(`/checkout/${sellerId}/${productId}`, {
            state: { fromProductPage: true }
          });
        }
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Network error. Please try again.');
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      try {
        sessionStorage.setItem('checkout_selectedLocation', JSON.stringify(selectedLocation));
      } catch (e) { }
    } else {
      try {
        sessionStorage.removeItem('checkout_selectedLocation');
      } catch (e) { }
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedPayment) {
      try {
        sessionStorage.setItem('checkout_selectedPayment', JSON.stringify(selectedPayment));
      } catch (e) { }
    } else {
      try {
        sessionStorage.removeItem('checkout_selectedPayment');
      } catch (e) { }
    }
  }, [selectedPayment]);

  if (hasRedirected.current) {
    return null;
  }

  if (loading || !orderItem) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentStep === 'checkout' && (
        <Checkout
          orderItem={orderItem}
          selectedLocation={selectedLocation}
          setShowLocationModal={setShowLocationModal}
          showLocationModal={showLocationModal}
          handleSaveLocation={handleSaveLocation}
          isLocationSaveDisabled={isLocationSaveDisabled()}
          provinces={provinces}
          districts={districts}
          municipals={municipals}
          wards={wards}
          modalProvince={modalProvince}
          modalDistrict={modalDistrict}
          modalMunicipal={modalMunicipal}
          modalWard={modalWard}
          onProvinceChange={handleProvinceChange}
          onDistrictChange={handleDistrictChange}
          onMunicipalChange={handleMunicipalChange}
          onWardChange={handleWardChange}
          subtotal={subtotal}
          deliveryCharge={total - subtotal}
          total={total}
          navigate={navigate}
          sellerId={sellerId}
          productId={productId}
          openLocationModal={openLocationModal}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          handleProceedToPayment={() => handleProceedToPayment(false)}
          onBack={() => navigate(-1)}
        />
      )}

      {currentStep === 'payment' && (
        <PaymentPage
          setSelectedPayment={setSelectedPayment}
          selectedPayment={selectedPayment}
          orderDetails={orderDetails}
          selectedLocation={selectedLocation}
          navigate={navigate}
          sellerId={sellerId}
          productId={productId}
          orderItem={orderItem}
          handleConfirmPayment={handleConfirmPayment}
        />
      )}

      {currentStep === 'confirmation' && (
        <ConfirmationPage
          orderId={orderId}
          orderNumber={orderNumber}
          selectedPayment={selectedPayment}
          selectedLocation={selectedLocation}
          orderItem={orderItem}
          navigate={navigate}
          sellerId={sellerId}
          productId={productId}
          setSelectedPayment={setSelectedPayment}
          setSelectedLocation={setSelectedLocation}
        />
      )}
    </>
  );
}