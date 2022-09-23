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

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().label("Password"),
});

function Login(props) {
  const navigate = useNavigate();

  const authLogin = useAuth();

  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async ({ email, password }) => {
    try {
      setLoad(true);
      console.log(email, password);
      const res = await registerApi.loginApi(email, password);
      console.log(res);

      if (!res.data.message[0].name) {
        setLoad(false);
        setOpen(true);
        setMessage(res.data.message);
      } else {
        await storage.storeToken(email + ":" + res.data.message[1].api_secret);
        const doctorID = res.data.message[0].name;
        const fname = res.data.message[0].first_name;
        const lname = res.data.message[0].last_name;
        await storage.storeId(doctorID, fname, lname, email);
        authLogin.logIn(doctorID, fname, lname, email);
        setLoad(false);
      }
    } catch (error) {
      console.log("Error", error);
      setLoad(false);
    }
  };

  const logOut = async () => {
    try {
      const user = await storage.getUser();
      if (user) {
        navigate("/doctorhomepage");
      } else {
        await storage.removeToken();
        await storage.removeId();
        await storage.removeScheduleName();
        await storage.removeProfileComplete();
        await storage.removeField();
        authLogin.logOut();
        const res = await registerApi.logout();
        navigate("/");
      }
    } catch (error) {
      console.log("Error", error);
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
      <>
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
                          Cloud Clinic
                        </h3>
                        <div className=" color pt-2 ">
                          Streamlines Electronic Patient Record Keeping
                        </div>
                      </div>
                      <CustomForm
                        initialValues={{
                          email: "",
                          password: "",
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                      >
                        <ShowMessage view={open} Message={message} />
                        <h3 className="mt-3 mb-4 color text-center pb-2 ">
                          Login to Your Account
                        </h3>
                        <div className="form-outline mb-4">
                          <FormTextInput
                            type="email"
                            name="email"
                            id="email"
                            className="mt-30 form-control indent"
                            placeholder="Email address"
                            onClick={() => setOpen(false)}
                            icon={<img src={email} className="ml5px" alt="" />}
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <FormTextInput
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            className="mt-30 form-control indent "
                            onClick={() => setOpen(false)}
                            icon={<img src={lock} className="ml5px" alt="" />}
                          />
                        </div>
                        <div className="text-center pt-1 mb-5 pb-1">
                          <CustomButton
                            className="btn col-12 btn-block fa-lg gradient-custom-2 mb-3"
                            type="submit"
                            title="Login"
                          >
                            Log in
                          </CustomButton>
                          <a className="text-muted" href="#!">
                            Forgot password?
                          </a>
                        </div>
                      </CustomForm>
                    </div>
                  </div>
                  <div className="col-lg-5 d-flex align-items-center gradient-custom-2">
                    <div className="text-white px-3 py-4  mx-md-4 mt-5">
                      <h4 className="mt-5 pb-3">New Here?</h4>
                      <p className="small  fs-6 pb-3 mt-3">
                        Sign up and discover a great amount of new oppurtunities
                      </p>
                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <Link
                          to="/register"
                          className="btn col-12 btn-sm btn-outline-success text-success bg-light"
                        >
                          Sign Up
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
    </>
  );
}

export default Login;
