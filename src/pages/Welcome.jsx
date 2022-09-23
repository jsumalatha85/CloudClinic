import React from "react";
import { Link } from "react-router-dom";
import logo from "../assests/logo.png";

function Welcome(props) {
  return (
    <>
      <div className="container">
        <section>
          <div className="row rpd">
            <div className="col-sm-3 col-md-3 col-lg-3"></div>
            <div className="col-sm-6 col-md-6 col-lg-6 pd mt-5">
              <div className="pd card shadow">
                <img src={logo} className="logo" />
                <h2 class="color text-center mt-3 pt-3">Cloud Clinic</h2>
                <h6 class="color text-center">
                  Streamlines Electronic Patient Record Keeping
                </h6>
                <form>
                  <div className="form-group row mt-4">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <Link
                        to="/login"
                        id="register"
                        className="btn col-12"
                        name="register"
                        type="button"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                  <div className="form-group row mt-4">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <Link
                        to="/register"
                        id="login"
                        className="btn col-12"
                        name="login"
                        type="button"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-3"></div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Welcome;
