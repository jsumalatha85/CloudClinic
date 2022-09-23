import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import registerApi from "../api/register";
import storage from "../auth/storage";
import useAuth from "../auth/useAuth";
import AuthContext from "../auth/context";
import CustomButton from "../component/common/CustomButton";
import DoctorHomeList from "./DoctorHomeList";

function DoctorHome(props) {
  const authLogin = useAuth();
  const navigate = useNavigate();
  const { setProfile, setField } = useContext(AuthContext);
  const [name, setName] = useState();

  const getInfo = async () => {
    try {
      const user = await storage.getUser();
      console.log("Name", user);
      if (!user) {
        navigate("/");
      }
      setName(user);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Logout");
      await storage.removeToken();
      await storage.removeId();
      await storage.removeScheduleName();
      setProfile(0);
      setField(14);
      authLogin.logOut();
      await registerApi.logout();
      navigate("/");
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleSubmit1 = () => {
    console.log("Register");
    navigate("/basicinformation");
    window.location.reload();
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <section>
        <div className="row no-gutters">
          <div className="col-12">
            <div class="header">
              <h3 className=" text-center">Doctor Consultation </h3>
              <div class="">
                {/* <span class="home">
                  <img
                    className="pointer"
                    src={home}
                    alt=""
                    height="40"
                    width="50"
                    onClick={() => navigate("/doctorhomepage")}
                  />
                </span> */}
                <span class="signout">
                  <CustomButton
                    title={"Dr. " + name}
                    className="btn topbtn"
                    onClick={handleSubmit1}
                  />
                  <CustomButton
                    title="Logout"
                    className="btn topbtn"
                    onClick={handleSubmit}
                  />
                </span>
              </div>
            </div>
            <hr></hr>
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-3 col-lg-2 mrgnav">
            <DoctorHomeList />
          </div>
        </div>
      </section>
    </>
  );
}

export default DoctorHome;
