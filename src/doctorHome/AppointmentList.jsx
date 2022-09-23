import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import doctorHomePageApi from "../api/doctorHomePage";
import storage from "../auth/storage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomTextInput from "../component/common/CustomTextInput";
import EmptyComponent from "../component/common/EmptyComponent";
import DoctorHome from "./DoctorHome";
import ConsultationHistory from "./ConsultationHistory";

function UpcomingAppointment(props) {
  const [upcomingApp, setUpcomingApp] = useState([]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();

  // const disablePastDate = () => {
  //   try {
  //     const today = new Date();
  //     const dd = String(today.getDate()).padStart(2, "0");
  //     const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  //     const yyyy = today.getFullYear();
  //     const todDate = yyyy + "-" + mm + "-" + dd;
  //     return todDate;
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };

  const handleFilterDate = async (event) => {
    getPatientList(event.target.value);
  };

  // const handleCancel = async (appointmentID) => {
  //   try {
  //     setLoad(true);
  //     //console.log("appointmentID", appointmentID);
  //     const res = await doctorHomePageApi.cancelAppointment(appointmentID);
  //     //console.log("res--", res);
  //     getPatientList();
  //     setLoad(false);
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };

  // const handleReschedule = async (appointmentID) => {
  //   //console.log("appointmentID", appointmentID);
  //   navigate("/newappointment", { state: { appointmentID } });
  // };

  const handleClick = async (nam) => {
    try {
      console.log("nam--", nam);
      const doctorID = await storage.getID();
      const res = await doctorHomePageApi.getConsultationName(doctorID, nam);
      console.log("res--", res);
      const consultationName = res.data.data[0].name;
      navigate("/endconsultation", { state: { consultationName } });
    } catch (ex) {
      console.log(ex);
    }
  };

  const getPatientList = async (date) => {
    try {
      setLoad(true);
      console.log("date--", date);
      if (!date) {
        setMessage(false);
        setLoad(false);
        return;
      }
      setDate(date);
      const doctorID = await storage.getID();
      const res = await doctorHomePageApi.appointmentList(doctorID, date);
      setMessage(true);
      console.log("res.data.data", res.data.data);
      setUpcomingApp(res.data.data);

      setLoad(false);
      return;
    } catch (ex) {
      console.log(ex);
    }
  };
  useEffect(() => {
    getPatientList("");
  }, []);

  return (
    <>
      <CustomActivityIndicator
        style={{ height: 100, alignSelf: "center" }}
        visible={load}
      />
      <DoctorHome />
      <section>
        <div className="row no-gutters mt-225 divpd">
          <div className="col-sm-2 col-md-2 col-lg-2"></div>
          <div className="col-sm-12 col-md-10 col-lg-10">
            <div className="row no-gutters mt-2">
              <div className="col-sm-2 col-md-2 col-lg-2"></div>
              <div className="col-sm-8 col-md-8 col-lg-8 mt-4 mb-4">
                <div className="pd card shadow mt-4">
                  <h4 class="content-heading">Appointment List</h4>
                  <div className="form-group mt-4">
                    <label className="control-label mb-2">
                      Appointment Date
                    </label>
                    <div className="col-sm-12 col-md-6 col-lg-4 text-center">
                      <CustomTextInput
                        type="date"
                        className="form-control"
                        name="date"
                        value={date}
                        //min={disablePastDate()}
                        onChange={handleFilterDate}
                      />
                    </div>
                  </div>

                  <div id="report">
                    {upcomingApp.length > 0 ? (
                      <>
                        <table className="table table-bordered mt-4">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Time Slot</th>
                              <th>Patient Name</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {upcomingApp.map((item) => {
                              const appDate = item.appointment_date.split("-");
                              return (
                                <tr>
                                  <td>
                                    {appDate[2] +
                                      "-" +
                                      appDate[1] +
                                      "-" +
                                      appDate[0]}
                                  </td>
                                  <td>
                                    {item.appointment_time.split(":")[0] +
                                      ":" +
                                      item.appointment_time.split(":")[1]}
                                  </td>
                                  {item.status === "Closed" ? (
                                    <td
                                      className="pointer"
                                      onClick={() => handleClick(item.name)}
                                    >
                                      {item.patient_name}
                                    </td>
                                  ) : (
                                    <td>{item.patient_name}</td>
                                  )}
                                  <td>{item.status}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="psNote">
                          * Click on patient name to view Consultation Summary
                          on closed status
                        </div>
                      </>
                    ) : (
                      message && (
                        <EmptyComponent title=" No Appointment on this date" />
                      )
                    )}
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

export default UpcomingAppointment;
