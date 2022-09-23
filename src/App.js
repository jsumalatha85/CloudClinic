import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AuthContext from "./auth/context";
import storage from "./auth/storage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointment from "./doctorRegistration/Appointment";
import AppointmentList from "./doctorHome/AppointmentList";
import BasicInformation from "./doctorRegistration/BasicInformation";
import Education from "./doctorRegistration/Education";
import ConsultationHistory from "./doctorHome/ConsultationHistory";
import DoctorHome from "./doctorHome/DoctorHome";
import DoctorHomePage from "./doctorHome/DoctorHomePage";
import EndConsultation from "./doctorHome/EndConsultation";
import NewAppointment from "./doctorHome/NewAppointment";
import NewPatient from "./doctorHome/NewPatient";
import PatientHealthRecord from "./doctorHome/PatientHealthRecord";
import PatientList from "./doctorHome/PatientList";
import StartConsultation from "./doctorHome/StartConsultation";
import UpcomingAppointments from "./doctorHome/UpcomingAppointment";
import Footer from "./component/Footer";
import Navbar from "./component/common/navBar";
import "./App.css";

function App() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [lname, setLName] = useState();
  const [doctorID, setDoctorID] = useState();
  const [scheduleName, setScheduleName] = useState();
  const [profile, setProfile] = useState(0);
  const [field, setField] = useState(0);

  const getDoctor = async () => {
    try {
      const doctorID = await storage.getID();
      console.log("DoctorID", doctorID);
      setDoctorID(doctorID);
    } catch (error) {
      console.log("Error", error);
    }
  };
  // window.caches.delete();
  // window.localStorage.clear();

  // console.log = function () {};
  useEffect(() => {
    getDoctor();
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          name,
          setName,
          lname,
          setLName,
          email,
          setEmail,
          doctorID,
          setDoctorID,
          scheduleName,
          setScheduleName,
          profile,
          setProfile,
          field,
          setField,
        }}
      >
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={doctorID !== null ? <DoctorHomePage /> : <Login />}
          />
          <Route exact path="/register" element={<Register />} />
          <Route path="/basicinformation" element={<BasicInformation />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/education" element={<Education />} />
          <Route path="/doctorhome" element={<DoctorHome />} />
          <Route path="/doctorhomepage" element={<DoctorHomePage />} />
          <Route path="/newpatient" element={<NewPatient />} />
          <Route path="/patientlist" element={<PatientList />} />
          <Route path="/newappointment" element={<NewAppointment />} />
          <Route path="/patientrecord" element={<PatientHealthRecord />} />
          <Route
            path="/upcomingappointment"
            element={<UpcomingAppointments />}
          />
          <Route
            path="/consultationhistory"
            element={<ConsultationHistory />}
          />
          <Route path="/startconsultation" element={<StartConsultation />} />
          <Route path="/endconsultation" element={<EndConsultation />} />
          <Route path="/appointmentlist" element={<AppointmentList />} />
        </Routes>
        <Footer />
      </AuthContext.Provider>
    </>
  );
}

export default App;
