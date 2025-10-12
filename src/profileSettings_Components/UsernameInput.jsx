import React from "react";

const UsernameInput = ({ value, onChange, error, takenError, onEnter, onEscape }) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\s/g, "");
    
    if (val.length > 25) return;
    
    const regex = /^[a-zA-Z0-9._]*$/;
    
    if (!regex.test(val)) {
      onChange(val, "Only letters, numbers, periods, and underscores are allowed");
      return;
    }
    
    const hasLettersAfterNumbers = /\d+[a-zA-Z._]/.test(val);
    const symbolCount = (val.match(/[._]/g) || []).length;
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSymbol = /[._]/.test(val);
    
    let errorMsg = "";
    if (hasLettersAfterNumbers) {
      errorMsg = "Letters, periods, and underscores cannot come after numbers";
    } else if (symbolCount > 1) {
      errorMsg = "You can only use one symbol (either . or _)";
    } else if (val.length > 0 && !hasLetter) {
      errorMsg = "Username must contain at least one letter";
    } else if (val.length > 0 && !hasNumber) {
      errorMsg = "Username must contain at least one number";
    } else if (val.length > 0 && !hasSymbol) {
      errorMsg = "Username must contain at least one symbol (. or _)";
    }
    
    onChange(val, errorMsg);
  };

  return (
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
  );
};

export default UsernameInput;