import { useContext } from "react";
import AuthContext from "./context";
import authStorage from "./storage";

const useAuth = () => {
  const {
    doctorID,
    setDoctorID,
    name,
    setName,
    lname,
    setLName,
    email,
    setEmail,
  } = useContext(AuthContext);

  const logIn = (id, name, lname, email) => {
    setDoctorID(id);
    setName(name);
    setLName(lname);
    setEmail(email);
    authStorage.storeId(id, name, lname, email);
  };

  const logOut = () => {
    setDoctorID(null);
    setName(null);
    setLName(null);
    setEmail(null);
    authStorage.removeId();
  };
  return { doctorID, name, lname, email, logOut, logIn };
};

export default useAuth;
