
import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  Upload,
  X,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Tag,
  Save,
  Eye,
  Package,
  Info,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import API from "../../../Configs/ApiEndpoints";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Common/Loading";
// Import your API configuration
// import API from './path-to-your-API-file';

// For demo purposes, we'll define it here


export default function SellerProductUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const draggedIndexRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    culture: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    audience: "",
    adultSizes: [],
    childAgeGroups: [],
    tags: [],
    dimensions: "",
    material: "",
    careInstructions: "",
  });
  const [tagInput, setTagInput] = useState("");

useEffect(() => {
  return () => {
    images.forEach(img => {
      if (!img.isExisting && img.url) {
        URL.revokeObjectURL(img.url);
      }
    });
  };
}, []); // ✅ Empty dependency array

  useEffect(() => {
    if (selectedImage > images.length - 1) {
      setSelectedImage(Math.max(0, images.length - 1));
    }
  }, [images, selectedImage]);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file,
    }));

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      if (combined.length > 10) {
        toast.error("Maximum 10 images allowed");
        return combined.slice(0, 10);
      }
      return combined;
    });

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  }, [errors.images]);

  const removeImage = useCallback((id) => {
    setImages((prev) => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  
    const handleDragStart = useCallback((index) => {
      draggedIndexRef.current = index;
      setIsDragging(true); 
    }, []);
  
    const handleDragOver = useCallback((e) => {
      e.preventDefault();
    }, []);
  
    const handleDrop = useCallback((dropIndex) => {
      const dragIndex = draggedIndexRef.current;
      if (dragIndex === null || dragIndex === dropIndex) return;
  
      setImages((prev) => {
        const newImages = [...prev];
        const [moved] = newImages.splice(dragIndex, 1);
        newImages.splice(dropIndex, 0, moved);
        return newImages;
      });
  
      draggedIndexRef.current = null;
      setIsDragging(false);  // <-- ADD THIS LINE
    }, []);
  
    const handleDragEnd = useCallback(() => {
      draggedIndexRef.current = null;
      setIsDragging(false);  // <-- ADD THIS LINE
    }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleTagInputChange = useCallback((e) => {
    setTagInput(e.target.value);
  }, []);

  const commitTag = useCallback((tagValue) => {
    const cleaned = tagValue.trim().replace(/,$/, "");
    if (!cleaned) return;

    if (cleaned.length > 30) {
      toast.error("Tag must be less than 30 characters");
      return;
    }

    setFormData((prev) => {
      if (prev.tags.includes(cleaned)) {
        setErrors((prevErr) => ({
          ...prevErr,
          tags: "Tag already exists",
        }));
        return prev;
      }

      if (prev.tags.length >= 10) {
        setErrors((prevErr) => ({
          ...prevErr,
          tags: "Maximum 10 tags allowed",
        }));
        return prev;
      }

      setErrors((prevErr) => ({
        ...prevErr,
        tags: "",
      }));

      return { ...prev, tags: [...prev.tags, cleaned] };
    });
  }, []);

  const handleTagKeyDown = useCallback((e) => {
    if (e.key === " " || e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && formData.tags.length > 0) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.slice(0, -1)
      }));
    }
  }, [tagInput, formData.tags.length, commitTag]);

  const removeTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const toggleAudience = useCallback((audience) => {
    setFormData((prev) => ({
      ...prev,
      audience: prev.audience === audience ? "" : audience,
    }));
    if (errors.audience || errors.adultSizes || errors.childAgeGroups) {
      setErrors((prev) => ({
        ...prev,
        audience: "",
        adultSizes: "",
        childAgeGroups: "",
      }));
    }
  }, [errors.audience, errors.adultSizes, errors.childAgeGroups]);

  const toggleAdultSize = useCallback((size) => {
    setFormData((prev) => {
      const adultSizes = prev.adultSizes.includes(size)
        ? prev.adultSizes.filter((s) => s !== size)
        : [...prev.adultSizes, size];
      return { ...prev, adultSizes };
    });
    if (errors.adultSizes) {
      setErrors((prev) => ({ ...prev, adultSizes: "" }));
    }
  }, [errors.adultSizes]);

  const toggleChildAgeGroup = useCallback((group) => {
    setFormData((prev) => {
      const childAgeGroups = prev.childAgeGroups.includes(group)
        ? prev.childAgeGroups.filter((age) => age !== group)
        : [...prev.childAgeGroups, group];
      return { ...prev, childAgeGroups };
    });
    if (errors.childAgeGroups) {
      setErrors((prev) => ({ ...prev, childAgeGroups: "" }));
    }
  }, [errors.childAgeGroups]);

  useEffect(() => {
    if (formData.category !== "cultural-clothes") {
      if (
        formData.audience ||
        formData.adultSizes.length ||
        formData.childAgeGroups.length
      ) {
        setFormData((prev) => ({
          ...prev,
          audience: "",
          adultSizes: [],
          childAgeGroups: [],
        }));
      }
      return;
    }

    const isAdultAudience = formData.audience === "men" || formData.audience === "women";
    const isChildAudience = formData.audience === "boy" || formData.audience === "girl";

    if (!isAdultAudience && formData.adultSizes.length) {
      setFormData((prev) => ({ ...prev, adultSizes: [] }));
    }
    if (!isChildAudience && formData.childAgeGroups.length) {
      setFormData((prev) => ({ ...prev, childAgeGroups: [] }));
    }
  }, [
    formData.category,
    formData.audience,
    formData.adultSizes.length,
    formData.childAgeGroups.length,
  ]);

  const validateRequiredFields = useCallback(() => {
    const newErrors = {};

    if (!images.length) {
      newErrors.images = "Please upload at least one product image.";
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required.";
    } else if (formData.productName.trim().length < 3) {
      newErrors.productName = "Product name must be at least 3 characters.";
    } else if (formData.productName.trim().length > 100) {
      newErrors.productName = "Product name must not exceed 100 characters.";
    }

    if (!formData.productType.trim()) {
      newErrors.productType = "Product type is required.";
    }

    if (!formData.category) {
      newErrors.category = "Select a category.";
    }

    if (!formData.culture.trim() && formData.category === "cultural-clothes") {
      newErrors.culture = "Culture background is required for cultural clothes.";
    }

    if (!formData.price) {
      newErrors.price = "Price is required.";
    } else {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = "Enter a valid price greater than 0.";
      } else if (formData.price.length > 9) {
        newErrors.price = "Price must not exceed 9 digits.";
      }
    }

    if (!formData.stock && formData.stock !== "0") {
      newErrors.stock = "Stock quantity is required.";
    } else {
      const stockNum = Number(formData.stock);
      if (isNaN(stockNum) || stockNum < 0) {
        newErrors.stock = "Stock cannot be negative.";
      } else if (formData.stock.length > 9) {
        newErrors.stock = "Stock must not exceed 9 digits.";
      }
        else if(stockNum === 0){
        newErrors.stock = "Stock cannot be zero.";
   }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = "Description must not exceed 2000 characters.";
    }

    if (formData.category === "cultural-clothes") {
      if (!formData.audience) {
        newErrors.audience = "Select who the product is for.";
      } else if (
        (formData.audience === "men" || formData.audience === "women") &&
        formData.adultSizes.length === 0
      ) {
        newErrors.adultSizes = "Choose at least one adult size.";
      } else if (
        (formData.audience === "boy" || formData.audience === "girl") &&
        formData.childAgeGroups.length === 0
      ) {
        newErrors.childAgeGroups = "Choose at least one child age group.";
      }
    }
    if (formData.tags.length === 0) {
      newErrors.tags = "Please add at least one tag.";
    }
    if (formData.dimensions.trim() && !/^\d+(\.\d+)?\s*\*\s*\d+(\.\d+)?\s*\*\s*\d+(\.\d+)?$/.test(formData.dimensions.trim())) {
      newErrors.dimensions = "Dimensions must be in the format: Length * Width * Height";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [images.length, formData]);

  // UPDATED: Submit to PHP backend
  const submitToBackend = async (status) => {
    const formDataToSend = new FormData();

    // Append all form fields
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('productType', formData.productType);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('culture', formData.culture);
    formDataToSend.append('audience', formData.audience);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('dimensions', formData.dimensions);
    formDataToSend.append('material', formData.material);
    formDataToSend.append('careInstructions', formData.careInstructions);
    formDataToSend.append('status', status); // 'draft' or 'published'

    // Append arrays as JSON strings
    formDataToSend.append('tags', JSON.stringify(formData.tags));
    formDataToSend.append('adultSizes', JSON.stringify(formData.adultSizes));
    formDataToSend.append('childAgeGroups', JSON.stringify(formData.childAgeGroups));

    // Append images
    images.forEach((image) => {
      formDataToSend.append('images[]', image.file);
    });

    try {
      const response = await fetch(API.PRODUCT_UPLOAD, {
        method: 'POST',
        credentials: 'include', // Important for session cookies
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status === 'success') {
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Product upload error:', error);
      throw error;
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validateRequiredFields()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast.error("Please fix all errors before publishing");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitToBackend('published');
      toast.success(result.data.message || "Product published successfully!");

      // Clear form
      setFormData({
        productName: "",
        productType: "",
        culture: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        audience: "",
        adultSizes: [],
        childAgeGroups: [],
        tags: [],
        dimensions: "",
        material: "",
        careInstructions: "",
      });
      setImages([]);
      setErrors({});

      // Navigate after success
      setTimeout(() => navigate(`/seller/manageproducts/${user?.seller_id}`, { replace: true }), 700);
    } catch (error) {
      toast.error(error.message || "Failed to publish product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [validateRequiredFields, formData, images, errors, navigate]);

  const handleSaveDraft = useCallback(async () => {
    if (!validateRequiredFields()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast.error("Please fix all errors before publishing");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitToBackend('draft');
      toast.success(result.data.message || "Draft saved successfully!");

      setTimeout(() => navigate(`/seller/drafts/${user?.seller_id}`, { replace: true }), 700);
    } catch (error) {
      toast.error(error.message || "Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.productName, images.length, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Products
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Add New Product
              </h1>
              <p className="text-gray-600">
                Create a detailed listing with rich imagery and comprehensive information
              </p>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                Product Images

                {images.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({images.length}/10)
                  </span>
                )}
              </h2>

              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 mb-4">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].url}
                    alt={formData.productName || "Product preview"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                    <Upload className="w-16 h-16" />
                    <p className="text-sm text-center px-6 font-medium">
                      Upload product images
                    </p>
                    <p className="text-xs text-gray-400">First image will be the main product image</p>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (prev) => (prev - 1 + images.length) % images.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                      aria-label="Previous image">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                      aria-label="Next image">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {images.length === 0 && (
                  <label className="absolute inset-0 cursor-pointer hover:bg-gray-200/50 transition flex items-center justify-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden cursor-move group transition-all ${isDragging && draggedIndexRef.current === index ? "opacity-50 scale-95" : ""
                      } ${selectedImage === index
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3 h-3 text-gray-600" />
                    </div>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label="Remove image">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 10 && (
                  <label className="w-20 h-20 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-1 cursor-pointer hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Add</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Drag thumbnails to reorder. First image will be featured on the product listing. Max 5MB per image.
              </p>
              {errors.images && (
                <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.images}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-200">
                {[
                  { id: "basic", label: "Basic Info", icon: Tag },
                  { id: "details", label: "Details", icon: Package },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition ${activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}>
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {activeTab === "basic" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.productName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="Enter product name"
                      />
                      {errors.productName && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.productName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Product Type
                        </label>
                        <input
                          type="text"
                          name="productType"
                          value={formData.productType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.productType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="Traditional, Modern..."
                        />
                        {errors.productType && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.productType}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}>
                          <option value="" hidden>Select category</option>
                          <option value="cultural-clothes">Cultural Clothes</option>
                          <option value="musical-instruments">Musical Instruments</option>
                          <option value="handicraft-decors">Handicraft & Decors</option>
                        </select>
                        {errors.category && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.category}
                          </p>
                        )}
                      </div>
                    </div>

                    {formData.category === "cultural-clothes" && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Culture
                        </label>
                        <input
                          type="text"
                          name="culture"
                          value={formData.culture}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.culture ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="Newari, Tibetan, Tharu..."
                        />
                        {errors.culture && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.culture}
                          </p>
                        )}
                      </div>
                    )}

                    {formData.category === "cultural-clothes" && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Target audience
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {[
                              { id: "men", label: "Men" },
                              { id: "women", label: "Women" },
                              { id: "boy", label: "Boy" },
                              { id: "girl", label: "Girl" },
                            ].map((aud) => (
                              <button
                                key={aud.id}
                                type="button"
                                onClick={() => toggleAudience(aud.id)}
                                className={`px-5 py-2 rounded-lg border-2 font-medium transition ${formData.audience === aud.id
                                  ? "border-blue-500 bg-blue-500 text-white shadow-md"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                                  }`}>
                                {aud.label}
                              </button>
                            ))}
                          </div>
                          {errors.audience && (
                            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.audience}
                            </p>
                          )}
                        </div>

                        {(formData.audience === "men" ||
                          formData.audience === "women") && (
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-wide text-gray-700 font-semibold">
                                Available sizes (Adults)
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {["S", "M", "L", "XL", "XXL"].map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleAdultSize(size)}
                                    className={`px-5 py-2 rounded-lg border-2 font-medium transition ${formData.adultSizes.includes(size)
                                      ? "border-blue-500 bg-blue-500 text-white shadow-md"
                                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                                      }`}>
                                    {size}
                                  </button>
                                ))}
                              </div>
                              {errors.adultSizes && (
                                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.adultSizes}
                                </p>
                              )}
                            </div>
                          )}

                        {(formData.audience === "boy" ||
                          formData.audience === "girl") && (
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-wide text-gray-700 font-semibold">
                                Age groups (Children)
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {["5-6", "7-8", "9-10", "11-12", "13-14"].map(
                                  (group) => (
                                    <button
                                      key={group}
                                      type="button"
                                      onClick={() => toggleChildAgeGroup(group)}
                                      className={`px-5 py-2 rounded-lg border-2 font-medium transition ${formData.childAgeGroups.includes(group)
                                        ? "border-blue-500 bg-blue-500 text-white shadow-md"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                                        }`}>
                                      {group}
                                    </button>
                                  )
                                )}
                              </div>
                              {errors.childAgeGroups && (
                                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.childAgeGroups}
                                </p>
                              )}
                            </div>
                          )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Price (Rs)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          step="100"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500">Maximum 9 digits</p>
                        {errors.price && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.price}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.stock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500">Maximum 9 digits</p>
                        {errors.stock && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.stock}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Product Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        maxLength="2000"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="Describe your product in detail..."
                      />
                      <p className="text-xs text-gray-500">
                        {formData.description.length}/2000 characters (minimum 10)
                      </p>
                      {errors.description && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Tags
                      </label>
                      <div className={`flex flex-wrap gap-2 rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition ${errors.tags ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}>
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={tagInput}
                          onChange={handleTagInputChange}
                          onKeyDown={handleTagKeyDown}
                          className="flex-1 min-w-[120px] border-none focus:outline-none focus:ring-0 text-sm py-1 bg-transparent"
                          placeholder={
                            formData.tags.length ? "Add another tag" : "Type a tag and press space"
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Press space, enter, or comma to create a tag. Maximum 10 tags, minimum 1 tag.
                      </p>
                      {errors.tags && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.tags}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "details" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Material (Optional)
                        </label>
                        <input
                          type="text"
                          name="material"
                          value={formData.material}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none${errors.material ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="Silk, bamboo, cotton..."
                        />
                        {errors.material && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.material}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Dimensions (Optional)
                        </label>
                        <input
                          type="text"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                            ${errors.dimensions ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="L x W x H"
                        />
                        {errors.dimensions && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.dimensions}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Care Instructions (Optional)
                      </label>
                      <textarea
                        name="careInstructions"
                        value={formData.careInstructions}
                        onChange={handleInputChange}
                        rows="5"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none
                          ${errors.careInstructions ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="How to care for this product..."
                      />
                      {errors.careInstructions && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.careInstructions}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save className="w-5 h-5" />
                  {isSubmitting ? 'Saving...' : 'Save Draft'}
                  {isSubmitting && <Loading message="Saving..."/>
                  }
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                  <Eye className="w-5 h-5" />
                  {isSubmitting ? 'Publishing...' : 'Publish Product'}
                  {isSubmitting && <Loading message="Publishing..."/>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}