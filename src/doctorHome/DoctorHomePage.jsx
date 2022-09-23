import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import doctorHomePage from "../api/doctorHomePage";
import storage from "../auth/storage";
import DoctorHome from "./DoctorHome";
import access_time from "../assests/png/access_time.png";
import folder_shared from "../assests/png/folder_shared.png";
import supervisor_account from "../assests/png/supervisor_account.png";
import text_snippet from "../assests/png/text_snippet.png";
import perm_contact_calendar from "../assests/png/perm_contact_calendar.png";

function DoctorHomePage(props) {
  const navigate = useNavigate();
  const [patient, setPatient] = useState();
  const [appointment, setAppointment] = useState();
  const [consultation, setConsultation] = useState();
  const [patientRecord, setPatientRecord] = useState();
  const [currentAppt, setCurrentAppt] = useState();

  const getHomePage = async () => {
    try {
      const email = await storage.getEmail();
      const response = await doctorHomePage.getDetails(email);
      console.log(response);
      setPatient(response.data.message.Patient);
      setAppointment(response.data.message.Open_Scheduled);
      setConsultation(response.data.message.All);
      setCurrentAppt(response.data.message.Open);
      setPatientRecord(response.data.message.Closed);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleClick = () => {
    const today = new Date();
    console.log("today--", today);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const todDate = yyyy + "-" + mm + "-" + dd;
    navigate("/upcomingAppointment", { state: { date: todDate } });
  };

  useEffect(() => {
    getHomePage();
  }, []);
  return (
    <>
      <DoctorHome />
      <section>
        <div className="row no-gutters mt-225 divpdcat">
          <div className="row no-gutters">
            <div className="col-sm-2 col-md-2 col-lg-2"></div>
            <div className="col-sm-12 col-md-10 col-lg-10">
              <div className="row no-gutters mt-2">
                <div className="col-sm-1 col-md-1 col-lg-1"></div>
                <div className="col-sm-10 col-md-10 col-lg-10">
                  <div className="pd card shadow mt-4">
                    <h4 className="content-heading mt-2 ">All Categories</h4>
                    <div className="row">
                      <div className="col-sm-12 col-md-3 col-lg-3 mb-4">
                        <Link to="/patientlist" className="homelink">
                          <div className=" bg-violet cat">
                            <div className="bg-violet-dark inner-div">
                              <img src={supervisor_account} alt="" />
                            </div>
                            <h4 className="nomrgn">{patient} Patients</h4>
                            <p>
                              <span>Total Patients</span>
                            </p>
                          </div>
                        </Link>
                      </div>

                      <div className="col-sm-12 col-md-3 col-lg-3 mb-4">
                        <div
                          className="bg-blue cat pointer"
                          onClick={() => handleClick()}
                        >
                          <div className="bg-blue-dark inner-div">
                            <img src={folder_shared} alt="" />
                          </div>

                          <h4 className="nomrgn">{currentAppt} Appointment</h4>
                          <p>
                            <span>Today's Appointment</span>
                          </p>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-3 col-lg-3 mb-4">
                        <Link to="/appointmentlist" className="homelink">
                          <div className=" bg-sblue cat">
                            <div className="bg-sblue-dark inner-div">
                              <img src={perm_contact_calendar} alt="" />
                            </div>
                            <h4 className="nomrgn">
                              {consultation} All Appointments
                            </h4>
                            <p>
                              <span>Total Appointments</span>
                            </p>
                          </div>
                        </Link>
                      </div>
                      <div className="col-sm-12 col-md-3 col-lg-3 mb-4 ">
                        <Link to="/consultationhistory" className="homelink">
                          <div className="bg-pink cat">
                            <div className="bg-pink-dark inner-div">
                              <img src={text_snippet} alt="" />
                            </div>
                            <h4 className="nomrgn">
                              {patientRecord} Consultation
                            </h4>
                            <p>
                              <span>Total Patient Encounter Records</span>
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DoctorHomePage;
