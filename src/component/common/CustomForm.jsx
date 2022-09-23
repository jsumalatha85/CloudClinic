import React from "react";
import { Formik, Form } from "formik";

function CustomForm({ initialValues, onSubmit, validationSchema, children }) {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form class="justify-content-center align-items-center">{children}</Form>
    </Formik>
  );
}

export default CustomForm;
