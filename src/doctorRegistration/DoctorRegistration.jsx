import React, { useEffect, useContext, useState } from "react";
import doctorRegistration from "../api/doctorRegistration";
import AuthContext from "../auth/context";
import storage from "../auth/storage";
import DoctorRegistrationList from "./DoctorRegistrationList";
import home from "../assests/svg/home.svg";
import { useNavigate } from "react-router-dom";

function DoctorRegistration() {
  const [fname, setFname] = useState();
  const navigate = useNavigate();

  const { profile, setProfile, setField, field } = useContext(AuthContext);

  const getUser = async () => {
    const user = await storage.getUser();
    if (!user) {
      navigate("/");
    }
    setFname(user);
    const id = await storage.getID();
    const res = await doctorRegistration.getDetilsBasicInfo(id);
    // console.log(res, "BasicInformation");
    let count = 0;
    if (res.data.data.name) {
      count = count + 1;
      // console.log(count, res.data.data.name, "count1");
    }

    if (res.data.data.first_name) {
      count = count + 1;
      // console.log(count, res.data.data.first_name, "count2");
    }
    if (res.data.data.last_name) {
      count = count + 1;
      // console.log(count, res.data.data.last_name, "count3");
    }
    if (res.data.data.user_id) {
      count = count + 1;
      // console.log(count, res.data.data.user_id, "count4");
    }
    if (res.data.data.image) {
      count = count + 1;
      // console.log(count, res.data.data.image, "count5");
    }
    if (res.data.data.degree) {
      count = count + 1;
      // console.log(count, res.data.data.degree, "count6");
    }
    if (res.data.data.work_experience) {
      count = count + 1;
      // console.log(count, res.data.data.work_experience, "count7");
    }
    if (res.data.data.date_of_birth) {
      count = count + 1;
      // console.log(count, res.data.data.date_of_birth, "count8");
    }
    if (res.data.data.date_of_joining) {
      count = count + 1;
      // console.log(count, res.data.data.date_of_joining, "count9");
    }
    if (res.data.data.gender) {
      count = count + 1;
      // console.log(count, res.data.data.gender, "count10");
    }
    if (res.data.data.hospital) {
      count = count + 1;
      // console.log(count, res.data.data.hospital, "count11");
    }
    if (res.data.data.op_consulting_charge) {
      count = count + 1;
      // console.log(count, res.data.data.op_consulting_charge, "count12");
    }
    if (res.data.data.practitioner_schedules.length > 0) {
      count = count + 1;
      // console.log(
      //   count,
      //   res.data.data.practitioner_schedules.length,
      //   "count13"
      // );
    }

    const res1 = await doctorRegistration.attachImage(id);
    // console.log(res1);
    if (res1.data.data.length > 0) {
      count = count + 1;
      // console.log(count, res1.data.data.length, "count14");
    }
    // setCountTotal(count);
    // console.log(count);
    const profileComplete = (count / 14) * 100;
    // console.log(profileComplete);
    if (profile === 0) {
      await storage.storeProfileComplete(Math.round(profileComplete));
      await storage.storeField(14 - count);

      const profile = await storage.getProfileComplete();
      const field = await storage.getField();

      setProfile(Math.round(profile));
      setField(field);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <section>
        <div className="row no-gutters">
          <div className="col-12">
            <h4 className="header text-center">Doctor Registration</h4>
            {/* <span class="signouthome">
              <img
                className="pointer"
                src={home}
                alt=""
                height="40"
                width="50"
                onClick={() => navigate("/doctorhomepage")}
              />
            </span> */}
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-2 col-lg-2">
            <DoctorRegistrationList />
          </div>
          <div className="col-sm-12 col-md-10 col-lg-10 mt-2">
            <div className="row no-gutters text-center">
              <div className="col-sm-12 col-md-4 col-lg-4 rbdr text-center">
                {fname !== null ? <h5>Dr.{fname}</h5> : null}
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 rbdr text-center">
                <h5>{profile}% profile Complete</h5>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow="70"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    width="70%"
                    style={{
                      width: profile !== 0 ? profile + "%" : null,
                    }}
                  ></div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 text-center">
                <h5>{field} Pending Mandatory Field</h5>
              </div>
            </div>
            <hr className="mt-2"></hr>
          </div>
        </div>
      </section>
    </>
  );
}

export default DoctorRegistration;
