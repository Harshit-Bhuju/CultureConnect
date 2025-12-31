import React from "react";

const CardBox = ({ title, items = [], footerLink, footerText }) => {
  return (
    <div className="bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      {/* Title */}
      <h2 className="text-[10px] min-[500px]:text-xs lg:text-2xl font-bold p-2 md:p-3 lg:p-4 leading-tight text-gray-900">
        {title}
      </h2>
      {/* Items grid */}
      <div className="grid grid-cols-2 gap-1 md:gap-2 lg:gap-3 px-2 md:px-3 lg:px-4 flex-grow shrink">
        {items.map((item, index) => (
          <div key={index} className="cursor-pointer">
            <div className="aspect-[1/1] bg-gray-100 rounded overflow-hidden">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover hover:opacity-90 transition"
              />
            </div>
            <p className="text-[5px] min-[400px]:text-[6px] min-[500px]:text-[8px] sm:text-xs mt-1 text-gray-700">{item.label}</p>
          </div>
        ))}
      </div>
      {/* Footer */}
      <a
        href={footerLink}
        className="text-[8px] sm:text-sm text-blue-600 hover:text-orange-600 lg:mt-2 p-2 md:p-3 lg:p-4"
      >
        {footerText}
      </a>
    </div>
  );
};

export default CardBox;
