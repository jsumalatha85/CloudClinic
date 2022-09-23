import React, { useState } from "react";
import CustomActivityIndicator from "./common/CustomActivityIndicator";
import CustomButton from "./common/CustomButton";
import CustomForm from "./common/CustomForm";
import ErrorMessage from "./common/ErrorMessage";
import FormTextInput from "./common/FormTextInput";
import ShowMessage from "./common/ShowMessage";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

function ForgotPassword(props) {
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <>
      <CustomActivityIndicator
        style={{ height: 100, alignSelf: "center" }}
        visible={load}
      />
      <div>
        <ShowMessage view={open} Message={message} />
        <CustomForm
          initialValues={{
            email: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <div>
            <FormTextInput
              autoCapitalize="none"
              keyboardType="email-address"
              name="email"
              placeholder="Email"
              inputIcon="email"
            />
            <ErrorMessage
              visible={err === "error" ? true : false}
              error={error}
            />
          </div>
          <div>
            <CustomButton title="Send" />
          </div>
        </CustomForm>
      </div>
    </>
  );
}

export default ForgotPassword;
