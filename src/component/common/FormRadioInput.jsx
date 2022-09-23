import React from "react";
import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";

function FormRadioInput({ data, name, placeholder, ...otherProps }) {
  const { errors, touched, handleChange } = useFormikContext();

  return (
    <>
      {data.map((item) => {
        return (
          <>
            <input
              type="radio"
              id={item.id}
              name={name}
              className="marg_radio"
              value={item.id}
              onChange={handleChange(name)}
              placeholder={placeholder}
              {...otherProps}
            />
            <label for={item.id} className="marg_label">
              {item.value}
            </label>
          </>
        );
      })}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormRadioInput;
