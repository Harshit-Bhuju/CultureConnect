import React from "react";

const UsernameInput = ({ value, onChange, error, takenError, onEnter, onEscape }) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\s/g, "").toLowerCase(); // Convert to lowercase
    
    if (val.length > 25) return;
    
    const regex = /^[a-z0-9._]*$/; // Only lowercase letters
    
    if (!regex.test(val)) {
      onChange(val, "Only lowercase letters, numbers, periods, and underscores are allowed");
      return;
    }
    
    let errorMsg = "";
    
    // Rule 1: Must start with a letter
    if (val.length > 0 && !/^[a-z]/.test(val)) {
      errorMsg = "Username must start with a lowercase letter";
    }
    // Rule 2: Must end with a number, underscore, or dot (NOT a letter)
    else if (val.length > 0 && !/[0-9_.]$/.test(val)) {
      errorMsg = "Username must end with a number, underscore (_), or dot (.)";
    }
    // Rule 3: Check minimum length
    else if (val.length > 0 && val.length < 3) {
      errorMsg = "Username must be at least 3 characters long";
    }
    // Rule 4: Must contain at least one letter
    else if (val.length > 0 && !/[a-z]/.test(val)) {
      errorMsg = "Username must contain at least one letter";
    }
    
    onChange(val, errorMsg);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter your username"
          className={`border-2 rounded-xl p-3 pr-16 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
            error || takenError ? "border-red-500" : "border-gray-200"
          }`}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") onEnter();
            if (e.key === "Escape") onEscape();
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
          {value.length}/25
        </div>
      </div>
      
   
      <div className="text-xs text-gray-500 space-y-1">
        <p>✓ Must start with a lowercase letter</p>
        <p>✓ Must end with a number, underscore (_), or dot (.)</p>
        <p>✓ Only lowercase letters, numbers, underscores, and dots allowed</p>
        <p>✓ Length: 3-25 characters</p>
      </div>
    </div>
  );
};

export default UsernameInput;