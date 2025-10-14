// ProductDetail.jsx - Product detail view component
import React from 'react';
import { products } from './products';
import './Carousel.css';

export const ProductDetail = ({ 
  productId, 
  productData = products, 
  onBack, 
  onAddToCart, 
  onCheckout 
}) => {
  const product = productData.find(p => p.id === parseInt(productId));

  if (!product) {
    return <div className="text-center p-20">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout(product);
    }
  };

  return (
    <div className="carousel showDetail relative h-[800px] overflow-hidden -mt-[50px]">
      <div className="gradient-blur"></div>
      
      <div className="list absolute w-full max-w-[1140px] h-[80%] left-1/2 -translate-x-1/2 px-[5%]">
        <div className="item absolute left-0 w-full h-full text-[15px]">
          <img
            src={product.image}
            alt={product.topic}
            className="w-1/2 absolute right-1/2 top-1/2 -translate-y-1/2 transition-all duration-[1.5s]"
          />
          
          <div className="detail w-1/2 absolute right-0 top-1/2 -translate-y-1/2 text-right">
            <div className="title text-[4em] font-medium opacity-0 animate-show-content">
              {product.detailTitle}
            </div>
            <div className="des text-sm text-[#5559] mt-4 opacity-0 animate-show-content-delay-1">
              {product.detailDescription}
            </div>
            <div className="specifications flex gap-[10px] w-full border-t border-[#5553] mt-5 pt-4 opacity-0 animate-show-content-delay-2">
              {product.specs.map((spec, index) => (
                <div key={index} className="w-[90px] text-center flex-shrink-0">
                  <p className="font-bold text-sm">{spec.label}</p>
                  <p className="text-sm text-[#5559]">{spec.value}</p>
                </div>
              ))}
            </div>
            <div className="checkout mt-5 opacity-0 animate-show-content-delay-3">
              <button 
                onClick={handleAddToCart}
                className="bg-transparent border border-[#5555] ml-1 px-[10px] py-[5px] tracking-[2px] font-medium hover:bg-gray-100"
              >
                ADD TO CART
              </button>
              <button 
                onClick={handleCheckout}
                className="bg-[#693EFF] text-white border-none ml-1 px-[10px] py-[5px] tracking-[2px] font-medium hover:bg-[#5830dd]"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="arrows absolute bottom-[10px] w-full max-w-[1140px] left-1/2 -translate-x-1/2 px-[5%]">
        <button
          id="back"
          onClick={onBack}
          className="absolute z-[100] bottom-0 left-1/2 -translate-x-1/2 border-none border-b border-[#555] font-bold tracking-[3px] bg-transparent p-[10px] hover:bg-[#eee] transition-opacity"
        >
          See All ↗
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;