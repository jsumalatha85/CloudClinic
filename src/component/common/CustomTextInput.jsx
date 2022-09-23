import React from "react";

function CustomTextInput({ icon, endicon, ...otherProps }) {
  return (
    <>
      {icon}
      <input {...otherProps} />
      {endicon}
    </>
  );
}

export default CustomTextInput;
