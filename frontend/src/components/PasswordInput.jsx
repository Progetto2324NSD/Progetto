import React, { useState } from "react";

// Stile
import 'boxicons/css/boxicons.min.css';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="input-group mb-1 d-flex align-items-center">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Inserire la password"}
        className="form-control form-control-lg bg-light fs-6"
      />
      <i
        className={`bx bx-${isShowPassword ? 'show' : 'hide'} cursor-pointer`}
        style={{ fontSize: '22px', color: isShowPassword ? '#0056b3' : 'gray', marginLeft: '10px' }}
        onClick={toggleShowPassword}
      />
    </div>
  );
};

export default PasswordInput;
