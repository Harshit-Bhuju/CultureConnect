import React, { useEffect } from "react";

const LocationForm = ({
  provinces,
  districts,
  municipals,
  wards,
  selectedProvince,
  selectedDistrict,
  selectedMunicipal,
  selectedWard,
  onProvinceChange,
  onDistrictChange,
  onMunicipalChange,
  onWardChange,
  initialLocation // Add this prop to receive the current location
}) => {
  
  // Parse and set initial location when modal opens
  useEffect(() => {
    if (initialLocation && initialLocation !== "Add Location") {
      const locationParts = initialLocation.split(", ");
      if (locationParts.length === 4) {
        onProvinceChange(locationParts[0]);
        onDistrictChange(locationParts[1]);
        onMunicipalChange(locationParts[2]);
        onWardChange(locationParts[3]);
      }
    }
  }, [initialLocation]);
  
  return (
    <div className="space-y-4">
      {/* Province Dropdown */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Province</label>
        <select
          value={selectedProvince}
          onChange={(e) => onProvinceChange(e.target.value)}
          className="border-2 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 border-gray-200 bg-white"
        >
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* District Dropdown */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">District</label>
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          disabled={!selectedProvince}
          className="border-2 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 border-gray-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Municipal Dropdown */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Municipality</label>
        <select
          value={selectedMunicipal}
          onChange={(e) => onMunicipalChange(e.target.value)}
          disabled={!selectedDistrict}
          className="border-2 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 border-gray-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Municipality</option>
          {municipals.map((municipal) => (
            <option key={municipal} value={municipal}>
              {municipal}
            </option>
          ))}
        </select>
      </div>

      {/* Ward Dropdown */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Ward</label>
        <select
          value={selectedWard}
          onChange={(e) => onWardChange(e.target.value)}
          disabled={!selectedMunicipal}
          className="border-2 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 border-gray-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward} value={ward}>
              {ward}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationForm;