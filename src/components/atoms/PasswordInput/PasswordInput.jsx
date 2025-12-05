import React, { useState } from "react";
import "./PasswordInput.scss";
import { Eye, EyeOff } from "lucide-react"; 

const PasswordInput = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <button 
        type="button"
        className="toggle-btn"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;