import React from "react";
import { X } from "lucide-react";

const CropModal = ({
  isOpen,
  imageToCrop,
  cropType = "logo", // 'logo' or 'banner'
  cropPosition,
  zoom,
  isDragging,
  imageSize,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
  onZoomChange,
  onSave,
  onCancel,
  cropImageRef,
  cropContainerRef,
}) => {
  if (!isOpen || !imageToCrop) return null;

  // Get container dimensions based on crop type
  const getContainerDimensions = () => {
    if (cropType === "banner") {
      // Banner: 1280x400 aspect ratio (3.2:1)
      const maxWidth = Math.min(window.innerWidth * 0.85, 1000);
      const height = maxWidth / 3.2; // Maintain 1280:400 ratio
      return { width: maxWidth, height };
    }
    // Logo: Square
    return { width: 320, height: 320 };
  };

  const container = getContainerDimensions();

  const getImageDisplaySize = () => {
    if (!imageSize.width || !imageSize.height) return { width: 0, height: 0 };

    const aspectRatio = imageSize.width / imageSize.height;
    let width, height;

    if (cropType === "banner") {
      // For banner, fill container width and allow vertical adjustment
      const containerAspect = container.width / container.height;

      if (aspectRatio >= containerAspect) {
        // Image is wider - match height
        height = container.height;
        width = height * aspectRatio;
      } else {
        // Image is taller - match width
        width = container.width;
        height = width / aspectRatio;
      }
    } else {
      // For logo, use cover behavior (fill container)
      if (aspectRatio >= container.width / container.height) {
        height = container.height;
        width = height * aspectRatio;
      } else {
        width = container.width;
        height = width / aspectRatio;
      }
    }

    return { width, height };
  };

  const dims = getImageDisplaySize();

  const containerClass =
    cropType === "banner"
      ? "relative mx-auto overflow-hidden rounded-xl shadow-lg"
      : "relative mx-auto overflow-hidden rounded-full shadow-lg";

  const title =
    cropType === "banner" ? "Adjust Your Banner" : "Adjust Your Photo";
  const instruction =
    cropType === "banner"
      ? "Drag to reposition • Scroll or use slider to zoom • Position horizontally"
      : "Drag to reposition • Scroll or use slider to zoom";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1100] bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
          <button
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            onClick={onCancel}
            aria-label="Close crop">
            <X size={20} />
          </button>
        </div>

        {/* Crop Area */}
        <div
          ref={cropContainerRef}
          className={containerClass}
          style={{
            width: `${container.width}px`,
            height: `${container.height}px`,
            background: "rgba(0,0,0,0.45)",
            marginBottom: 20,
          }}
          onWheel={onWheel}>
          {/* Overlay border */}
          <div
            className={
              cropType === "banner"
                ? "absolute inset-0 pointer-events-none z-10 border-4 border-white/30 rounded-xl"
                : "absolute inset-0 pointer-events-none z-10 border-4 border-white/30 rounded-full"
            }></div>

          {/* Grid overlay for banner */}
          {cropType === "banner" && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/10"></div>
                ))}
              </div>
            </div>
          )}

          <div
            className="absolute inset-0 flex items-center justify-center cursor-move select-none touch-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}>
            <img
              ref={cropImageRef}
              src={imageToCrop}
              alt="Crop preview"
              draggable="false"
              style={{
                width: `${dims.width}px`,
                height: `${dims.height}px`,
                transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.08s ease-out",
                userSelect: "none",
                touchAction: "none",
                maxWidth: "none",
              }}
            />
          </div>
        </div>

        {/* Instruction + Zoom */}
        <p className="text-white/80 text-sm text-center mb-3 px-2">
          {instruction}
        </p>

        <div className="px-2 mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-sm font-medium">Zoom</label>
            <span className="text-white/80 text-sm">{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer slider-thumb"
            style={{ WebkitAppearance: "none", appearance: "none" }}
          />
          <style>{`
            .slider-thumb::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .slider-thumb::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
          `}</style>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg">
            Save {cropType === "banner" ? "Banner" : "Photo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
