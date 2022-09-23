import React, { useContext, useEffect } from "react";
import LinkGroup from "../component/common/LinkGroup";

import storage from "../auth/storage";
import AuthContext from "../auth/context";

const DoctorRegistrationList = (props) => {
  const { profile, setProfile } = useContext(AuthContext);

  const getProfile = async () => {
    const profile = await storage.getProfileComplete();
    console.log(profile);
    setProfile(profile);
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div>
      <LinkGroup
        to="/basicinformation"
        title="Basic Information"
        // onClick={() => navigate("/basicinformation")}
      />
      <LinkGroup
        to={profile >= 71 ? "/appointment" : ""}
        title="Appointment Settings"
        // onClick={() => {
        //   if (profile >= 70) {
        //     navigate("/appointment");
        //   }
        // }}
      />

      <LinkGroup
        to={profile >= 93 ? "/education" : ""}
        title="Upload Certificate"
        // onClick={() => navigate("/education")}
      />
    </div>
  );
};

export default DoctorRegistrationList;
