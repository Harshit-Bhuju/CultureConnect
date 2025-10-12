import React, { useRef } from "react";
import { X } from "lucide-react";

const CropModal = ({
  isOpen,
  imageToCrop,
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
  cropContainerRef
}) => {
  if (!isOpen || !imageToCrop) return null;

  const getImageDisplaySize = () => {
    if (!imageSize.width || !imageSize.height) return { width: 0, height: 0 };
    
    const containerSize = 320;
    const aspectRatio = imageSize.width / imageSize.height;
    
    let width, height;
    if (aspectRatio > 1) {
      height = containerSize;
      width = height * aspectRatio;
    } else {
      width = containerSize;
      height = width / aspectRatio;
    }
    
    return { width, height };
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1100] bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-4">
          <h3 className="text-xl font-bold text-white">Adjust Your Photo</h3>
          <button
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            onClick={onCancel}
          >
            <X size={24} />
          </button>
        </div>

        {/* Crop Area */}
        <div 
          ref={cropContainerRef}
          className="relative w-80 h-80 mx-auto bg-black/50 rounded-full overflow-hidden mb-6"
          onWheel={onWheel}
        >
          <div className="absolute inset-0 rounded-full border-4 border-white/30 pointer-events-none z-10"></div>

          <div
            className="absolute inset-0 flex items-center justify-center cursor-move select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}
          >
            <img
              ref={cropImageRef}
              src={imageToCrop}
              alt="Crop preview"
              className="block"
              draggable="false"
              style={{
                width: `${getImageDisplaySize().width}px`,
                height: `${getImageDisplaySize().height}px`,
                transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            />
          </div>
        </div>

        {/* Instruction Text */}
        <p className="text-white/70 text-sm text-center mb-4 px-4">
          Drag to reposition • Scroll to zoom • Use slider to zoom
        </p>

        {/* Zoom Slider */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-sm font-medium">Zoom</label>
            <span className="text-white/70 text-sm">{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer slider-thumb"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
            }}
          />
          <style>{`
            .slider-thumb::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .slider-thumb::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .slider-thumb::-webkit-slider-thumb:hover {
              background: #2563eb;
              transform: scale(1.1);
            }
            .slider-thumb::-moz-range-thumb:hover {
              background: #2563eb;
              transform: scale(1.1);
            }
          `}</style>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
          >
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;