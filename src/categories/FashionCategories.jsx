import React from "react";

export default function FashionCategories() {
  const categories = [
    {
      id: 1,
      title: "Dance",
      image:
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      buttonText: "Learn Course",
    },
    {
      id: 2,
      title: "Songs",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      buttonText: "Learn Course",
    },
    {
      id: 3,
      title: "Instruments",
      image:
        "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80",
      buttonText: "Learn Course",
    },
  ];

  return (
    <div className="py-5 md:py-12 px-2 md:px-5 bg-gray-100">
      <div className="max-w-3xl mx-auto">
      <h1
        className={`text-xl sm:text-2xl text-center font-bold text-gray-900 md:text-3xl lg:text-4xl `}>
        Learn Culture
      </h1>
      {/* Grid container */}
      <div className="grid grid-cols-3 gap-3 mt-4 md:mt-6 lg:mt-10">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group relative cursor-pointer w-full aspect-[296/258] overflow-hidden">
            {/* Background Image - zooms in on hover */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${category.image})`,
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Title - positioned at bottom */}
            <div className="absolute bottom-[20%] left-0 right-0 flex justify-center text-white transition-transform duration-500 group-hover:translate-y-[-15px] min-[450px]:group-hover:translate-y-[-18px] min-[900px]:group-hover:translate-y-[-20px]">
              <h3 className="text-[10px] min-[450px]:text-base min-[900px]:text-xl font-semibold">
                {category.title}
              </h3>
            </div>

            {/* Shop Now with underline - appears on hover */}
            <div className="absolute bottom-[10%] left-0 right-0 flex flex-col items-center text-white transform transition-all duration-500 opacity-0 group-hover:opacity-100">
              <div className="text-[10px] min-[420px]:text-xs min-[900px]:text-sm h-7 font-medium">
                {category.buttonText}
              </div>
              <div className="h-px bg-white w-14 min-[450px]:w-16 min-[900px]:w-20"></div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
