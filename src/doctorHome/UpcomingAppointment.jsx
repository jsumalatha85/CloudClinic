import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import doctorHomePageApi from "../api/doctorHomePage";
import storage from "../auth/storage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomTextInput from "../component/common/CustomTextInput";
import EmptyComponent from "../component/common/EmptyComponent";
import ErrorMessage from "../component/common/ErrorMessage";
import DoctorHome from "./DoctorHome";

function UpcomingAppointment(props) {
  const [upcomingApp, setUpcomingApp] = useState([]);
  const [date, setDate] = useState();
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [showDate, setShowDate] = useState(false);

  // const upcomingAppointment = async () => {
  //   const res = await doctorHomePageApi.patientEncounter();
  //   console.log(res);
  // };

  const navigate = useNavigate();
  const location = useLocation();

  const disablePastDate = () => {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = today.getFullYear();
      const todDate = yyyy + "-" + mm + "-" + dd;
      return todDate;
    } catch (ex) {
      console.log(ex);
    }
  };

  const disableFutureDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    console.log(yyyy + "-" + mm + "-" + dd, "test");
    return yyyy + "-" + mm + "-" + dd;
  };

  const handleFilterDate = async (event) => {
    try {
      setShowDate(false);
      // const value = event.target.value.split("-");
      location.state = "";
      setLoad(true);
      const value = event.target.value;
      setDate(value);

      console.log(value, disablePastDate());
      if (!value) {
        setShow(false);
        setLoad(false);
        return;
      }
      if (value >= disablePastDate() && value <= disableFutureDate()) {
        const doctorID = await storage.getID();
        const res = await doctorHomePageApi.filterDateConsultation(
          doctorID,
          value
        );
        console.log("Date", res);
        if (res.ok === true) {
          setShow(true);
          setUpcomingApp(res.data.data);
        } else {
          setShowDate(true);
          setShow(false);
        }
        setLoad(false);
      } else {
        setLoad(false);
        setShowDate(true);
      }
    } catch (ex) {
      setLoad(false);
      console.log(ex);
    }
  };

  const handleClick = async (appointmentID) => {
    navigate("/startconsultation", { state: { appointmentID } });
  };
  const handleCancel = async (appointmentID) => {
    try {
      setLoad(true);
      //console.log("appointmentID", appointmentID);
      const res = await doctorHomePageApi.cancelAppointment(appointmentID);
      //console.log("res--", res);
      getPatientList();
      setLoad(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleReschedule = async (appointmentID) => {
    //console.log("appointmentID", appointmentID);
    navigate("/newappointment", { state: { appointmentID } });
  };

  const getPatientList = async () => {
    try {
      setLoad(true);
      console.log("location.state---", location.state);
      let todayDate = date;

      if (location.state && location.state.date !== "") {
        todayDate = location.state.date;
        setDate(location.state.date);
      }
      //console.log("todayDate--", todayDate);
      if (!todayDate) {
        setShow(false);
        setLoad(false);
        return;
      }

      const doctorID = await storage.getID();
      const res = await doctorHomePageApi.filterDateConsultation(
        doctorID,
        todayDate
      );
      setShow(true);
      //console.log("res.data.data", res.data.data);
      setUpcomingApp(res.data.data);

      setLoad(false);
      return;
    } catch (ex) {
      console.log(ex);
    }
  };
  useEffect(() => {
    getPatientList();
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
                  <h4 class="content-heading">Manage Appointment</h4>
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
                        min={disablePastDate()}
                        max={disableFutureDate()}
                        onChange={handleFilterDate}
                      />
                    </div>
                    <ErrorMessage
                      error={"Enter the valid date"}
                      visible={showDate}
                    />
                  </div>

                  <div id="report" className="table-responsive">
                    {upcomingApp.length > 0 ? (
                      <table className="table table-bordered mt-4">
                        <thead>
                          <tr>
                            <th>Time Slot</th>
                            <th>Patient Name</th>
                            <th>Status</th>
                            <th>Reschedule</th>
                            <th>Cancel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingApp.map((item) => (
                            <tr>
                              <td>
                                {item.appointment_time.split(":")[0] +
                                  ":" +
                                  item.appointment_time.split(":")[1]}
                              </td>
                              <td>{item.patient_name}</td>
                              <td>
                                {item.status !== "Open" ? (
                                  <CustomButton
                                    type="submit"
                                    className="btn col-sm-12 col-md-11 col-lg-11"
                                    title="Scheduled"
                                  />
                                ) : (
                                  <CustomButton
                                    type="submit"
                                    className="btn col-sm-12 col-md-11 col-lg-11"
                                    title="Start Counsultation"
                                    onClick={() => handleClick(item.name)}
                                  />
                                )}
                              </td>
                              <td>
                                <CustomButton
                                  type="submit"
                                  className="btn col-sm-12 col-md-11 col-lg-11"
                                  title="Reschedule"
                                  onClick={() => handleReschedule(item.name)}
                                />
                              </td>
                              <td className="App pointer">
                                <CustomButton
                                  type="button"
                                  className="btn bg-pink-dark col-sm-12 col-md-11 col-lg-11"
                                  title="Cancel"
                                  onClick={() => {
                                    handleCancel(item.name);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      show && (
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
