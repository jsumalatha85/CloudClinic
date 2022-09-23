import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import registerApi from "../api/register";
import storage from "../auth/storage";
import useAuth from "../auth/useAuth";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomForm from "../component/common/CustomForm";
import FormTextInput from "../component/common/FormTextInput";
import ShowMessage from "../component/common/ShowMessage";
import email from "../assests/svg/email.svg";
import lock from "../assests/svg/lock.svg";
import logo from "../assests/logoimg.png";
import phone from "../assests/svg/phone.svg";
import person from "../assests/svg/person.svg";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().min(3).max(100).label("First Name"),
  lastname: Yup.string().required().min(1).max(100).label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  mobile: Yup.string()
    .required("Mobile Number is Required")
    .min(10)
    .max(10)
    .label("Mobile Number")
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    ),
  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmpassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords does not match"),
});

function Register(props) {
  const navigate = useNavigate();
  const authLogin = useAuth();
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();

  const handleSubmit = async ({
    firstname,
    lastname,
    email,
    mobile,
    password,
  }) => {
    try {
      setLoad(true);
      const response = await registerApi.signUp(
        email,
        firstname,
        lastname,
        mobile,
        password
      );
      console.log(response);
      if (response.ok === false) {
        setLoad(false);
        setOpen(true);

        console.log(
          typeof JSON.parse(JSON.parse(response.data._server_messages)[0])
            .message
        );

        setMessage(
          JSON.parse(JSON.parse(response.data._server_messages)[0]).message
        );
      } else {
        await storage.storeToken(
          email + ":" + response.data.message[1].api_secret
        );
        const doctorId = response.data.message[0].name;
        console.log(doctorId, "DoctorID");

        await storage.storeId(doctorId, firstname, lastname, email);
        authLogin.logIn(doctorId, firstname, lastname, email);
        navigate("/basicinformation", {
          replace: true,
        });
      }
      setLoad(false);
    } catch (error) {
      console.log("Error1", error);
      setLoad(false);
    }
  };

  const logOut = async () => {
    try {
      const user = await storage.getUser();
      if (user) {
        navigate("/basicinformation");
      } else {
        await storage.removeToken();
        await storage.removeId();
        await storage.removeScheduleName();
        await storage.removeProfileComplete();
        await storage.removeField();
        authLogin.logOut();
        const res = await registerApi.logout();
        navigate("/register");
      }
    } catch (error) {
      console.log("Error1", error);
    }
  };

  useEffect(() => {
    logOut();
  }, []);

  return (
    <>
      <CustomActivityIndicator
        style={{ height: 100, alignSelf: "center" }}
        visible={load}
      />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10 mb-4">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-7">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img src={logo} className="login_logo" alt="logo" />
                      <h3 className=" color text-center  pt-1 ">
                        Basic Information
                      </h3>
                    </div>
                    <CustomForm
                      initialValues={{
                        firstname: "",
                        lastname: "",
                        email: "",
                        mobile: "",
                        password: "",
                        confirmpassword: "",
                      }}
                      onSubmit={handleSubmit}
                      validationSchema={validationSchema}
                    >
                      <ShowMessage view={open} Message={message} />
                      <div className="form-group row mt-4 justify-content-center align-items-center">
                        <div className="col-xs-12 col-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="text"
                            name="firstname"
                            id="firstname"
                            className="mt-30 form-control indent"
                            placeholder="First Name"
                            onClick={() => setOpen(false)}
                            icon={<img src={person} className="ml5px" alt="" />}
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4 justify-content-center align-items-center">
                        <div className="col-xs-12 col-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="text"
                            name="lastname"
                            id="lastname"
                            className="mt-30 form-control indent"
                            placeholder="Last Name"
                            onClick={() => setOpen(false)}
                            icon={<img src={person} className="ml5px" alt="" />}
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4 justify-content-center align-items-center">
                        <div className="col-xs-12 col-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="email"
                            name="email"
                            id="email"
                            className="mt-30 form-control indent"
                            placeholder="Email Address"
                            onClick={() => setOpen(false)}
                            icon={<img src={email} className="ml5px" alt="" />}
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4 justify-content-center align-items-center">
                        <div className="col-xs-12 col-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="tel"
                            name="mobile"
                            id="mobile"
                            maxlength="10"
                            className="mt-30 form-control indent"
                            placeholder="Mobile Number"
                            onClick={() => setOpen(false)}
                            icon={<img src={phone} className="ml5px" alt="" />}
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4 justify-content-center align-items-center">
                        <div className="col-xs-12 col-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="password"
                            name="password"
                            id="password"
                            className="mt-30 form-control indent"
                            placeholder="Password"
                            onClick={() => setOpen(false)}
                            icon={<img src={lock} className="ml5px" alt="" />}
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4 justify-content-center align-items-center">
                        <div className="col-xs-12 col-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="password"
                            name="confirmpassword"
                            id="confirmpassword"
                            className="mt-30 form-control indent"
                            placeholder="Confirm Password"
                            onClick={() => setOpen(false)}
                            icon={<img src={lock} className="ml5px" alt="" />}
                          />
                        </div>
                      </div>
                      <div className="form-group row rpd justify-content-center align-items-center">
                        <div className="col-xs-12 col-12 col-md-12 col-lg-12">
                          <CustomButton
                            type="submit"
                            className="btn col-12 btn-block fa-lg gradient-custom-2 mt-3"
                            title="Next"
                          />
                        </div>
                      </div>
                    </CustomForm>
                  </div>
                </div>
                <div className="col-lg-5 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4  mx-md-4 mt-5">
                    <h4 className="mt-5 pb-3">Already Registered User?</h4>
                    <p className="small  fs-6 pb-3 mt-3">
                      To keep connected with us please login with your personal
                      information
                    </p>
                    <div className="d-flex align-items-center justify-content-center pb-4">
                      <Link
                        to="/"
                        className="btn col-12 btn-sm btn-outline-success text-success bg-light"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
