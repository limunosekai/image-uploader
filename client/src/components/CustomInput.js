import React from "react";

function CustomInput({ type = "text", label, value, setValue, placeholder }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default CustomInput;
