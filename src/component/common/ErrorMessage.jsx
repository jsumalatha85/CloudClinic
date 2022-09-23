import React from "react";
import CustomText from "./CustomText";

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;
  return <CustomText style={{ color: "red" }}>{error}</CustomText>;
}

export default ErrorMessage;
