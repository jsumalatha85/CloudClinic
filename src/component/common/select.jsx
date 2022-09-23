import React from "react";
import ErrorMessage from "./ErrorMessage";

const Select = ({
  name,
  placeholder,
  options,
  onChange,
  error,
  visible,
  icon,
  ...rest
}) => {
  // console.log(options[0].value);
  return (
    <div className="form-group">
      {icon}
      <select
        name={name}
        id={name}
        onChange={onChange}
        {...rest}
        // className="form-control"
      >
        <option hidden value="">
          {placeholder}
        </option>
        {options.map((option) => {
          return (
            <option key={option.name} value={option.name}>
              {option.patient_name || option.name}
            </option>
          );
        })}
      </select>
      <ErrorMessage error={error} visible={visible} />
    </div>
  );
};

export default Select;
