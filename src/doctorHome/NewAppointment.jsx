import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import doctorRegistration from "../api/doctorRegistration";
import doctorHomePageApi from "../api/doctorHomePage";
import storage from "../auth/storage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomText from "../component/common/CustomText";
import CustomTextInput from "../component/common/CustomTextInput";
import ErrorMessage from "../component/common/ErrorMessage";
import Select from "../component/common/select";
import ShowMessage from "../component/common/ShowMessage";
import DoctorHome from "./DoctorHome";

function NewAppointment(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [inputs, setInputs] = useState();
  const [patient, setPatient] = useState([]);
  const [time, setTime] = useState();
  const [slot, setSlots] = useState();
  const [days, setDays] = useState();
  const [date, setDate] = useState();
  const [schedule, setSchedule] = useState();
  const [availableColor, setAvailableColor] = useState(false);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [showPatient, setShowPatient] = useState(false);
  const [showAppt, setShowAppt] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [showDate, setShowDate] = useState(false);

  let timeSlot = [];
  const today = new Date();
  const currentHr = today.getHours();
  const currentMin = today.getMinutes();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const currentDate = yyyy + "-" + mm + "-" + dd;

  const handleChange = (event) => {
    const value = event.target.value;
    console.log(event.target.value);
    setInputs(value);
    setShowPatient(false);
  };

  const handleFilterDate = async (e) => {
    try {
      setSchedule();
      setShowDate(false);
      setLoad(true);
      const date = e.target.value;
      console.log(date, disableFutureDate(), disablePastDate());
      if (date >= disablePastDate() && date <= disableFutureDate()) {
        setDate(date);

        const day = moment(date).format("dddd");
        setDays(day);
        setTime();
        const doctorID = await storage.getID();
        const res1 = await doctorHomePageApi.getScheduledSlots(doctorID, date);
        console.log("Res1", res1);
        setSchedule(res1.data.data);
        setLoad(false);
        setShow(false);
      } else {
        setLoad(false);
        setShowDate(true);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleClick = async (time) => {
    setShowAppt(false);
    console.log(time);
    setAvailableColor(true);
    setTime(time);
  };

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const disableFutureDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const handleSubmit = async () => {
    try {
      console.log(inputs, date, time, "inputs");

      if (!inputs) {
        setShowPatient(true);
        return;
      } else setShowPatient(false);
      if (!date) {
        setShow(true);
        return;
      } else setShow(false);
      if (!time) {
        setShowAppt(true);
        return;
      } else setShowAppt(false);
      setLoad(true);
      if (location.state && location.state.appointmentID) {
        console.log("App id", location.state.appointmentID);
        console.log("inputs", inputs);
        console.log("date", date);
        console.log("time", time);
        const res = await doctorHomePageApi.rescheduleAppointment(
          location.state.appointmentID,
          date,
          time
        );
        console.log("res--", res);
        navigate("/upcomingappointment", { state: { date } });
        setLoad(false);
        return;
      }
      const doctorID = await storage.getID();
      const res = await doctorHomePageApi.newAppointment(
        inputs,
        doctorID,
        date,
        time
      );
      console.log(res);
      if (res.ok === true) {
        setLoad(false);
        setOpen(true);
        setMessage("Appointment Booked Successfully");
        setTimeout(() => {
          setOpen(false);

          navigate("/newappointment");
          window.location.reload();
        }, 3000);
        return;
      } else {
        setOpen(true);
        setLoad(false);
        setMessage("Appointment Not Booked");
        setTimeout(() => {
          setOpen(false);

          navigate("/newappointment");
          window.location.reload();
        }, 3000);
        return;
      }
    } catch (error) {
      console.log("Error", error);
      setLoad(false);
    }
  };

  const getPatient = async () => {
    try {
      setLoad(true);

      if (location.state && location.state.appointmentID) {
        const appointmentres = await doctorHomePageApi.getPatientAppointment(
          location.state.appointmentID
        );
        console.log("appointmentres", appointmentres);
        console.log(
          "appointmentres.data.data.patient--",
          appointmentres.data.data[0].patient
        );
        setInputs(appointmentres.data.data[0].patient);
      }

      const res = await doctorHomePageApi.patient();
      console.log("Res", res);

      setPatient(res.data.data);
      const doctorID = await storage.getID();
      const res1 = await doctorRegistration.getDetilsBasicInfo(doctorID);
      console.log(res1);

      if (res1.data.data.practitioner_schedules.length > 0) {
        await storage.storeScheduleName(
          res1.data.data.practitioner_schedules[0].schedule
        );
      }

      const schedule = await storage.getScheduleName();
      console.log(schedule, "schedule");

      const res2 = await doctorHomePageApi.getSlots(schedule);
      console.log(res2.data.data.time_slots);
      setSlots(res2.data.data.time_slots);
      if (location.state && location.state.patientId) {
        const patientId = location.state ? location.state.patientId : "";
        console.log("patientId--", patientId);
        setInputs(patientId);
      }
      setLoad(false);
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };
  useEffect(() => {
    getPatient();
  }, []);
  return (
    <>
      <DoctorHome />
      <section>
        <div className="row no-gutters mt-225 divpd">
          <div className="row no-gutters">
            <div className="col-sm-2 col-md-2 col-lg-2"></div>
            <div className="col-sm-12 col-md-10 col-lg-10">
              <div className="row no-gutters mt-2">
                <div className="col-sm-2 col-md-2 col-lg-2"></div>
                <div className="col-sm-6 col-md-6 col-lg-6 mt-4 mb-4">
                  <div className="pd card shadow mt-4">
                    <h4 class="content-heading mb-2">New Appointment</h4>
                    <ShowMessage view={open} Message={message} />
                    <div className="form-group mt-2">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <label className="mb-2">Select Patient</label>
                        <Select
                          type="text"
                          name="patient"
                          id="patient"
                          options={patient}
                          value={inputs}
                          className="form-control"
                          onChange={handleChange}
                          disabled={
                            location.state && location.state.appointmentID
                              ? "disabled"
                              : ""
                          }
                          placeholder="Select Patient"
                          error={"Patient is a required field"}
                          visible={showPatient}
                        ></Select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="mb-2">Appointment Date</label>
                      <div className="col-sm-12 col-md-7 col-lg-5">
                        <CustomTextInput
                          type="date"
                          className="form-control"
                          name="date"
                          min={disablePastDate()}
                          max={disableFutureDate()}
                          required
                          onChange={handleFilterDate}
                          // onClick={() => {
                          //   setShow(false);
                          //   setShowDate(false);
                          // }}
                        />
                      </div>

                      <ErrorMessage
                        error={"Date of Appointment is a required field    "}
                        visible={show}
                      />
                      <ErrorMessage
                        error={
                          "Enter the valid date [ " +
                          disablePastDate() +
                          " to " +
                          disableFutureDate() +
                          " ] for appointment"
                        }
                        visible={showDate}
                      />
                    </div>

                    <CustomActivityIndicator
                      style={{
                        height: 75,
                        alignSelf: "center",
                      }}
                      visible={load}
                    />

                    <>
                      <div class="form-group row">
                        <label>
                          {slot &&
                          schedule &&
                          slot.some((e) => e.day === days) ? (
                            <>
                              <div className="row">
                                <label class="mb-2 mt-2">Available Slots</label>
                              </div>
                              <div className="row">
                                {slot.map((item) => {
                                  if (days === item.day) {
                                    timeSlot = [
                                      ...timeSlot,
                                      item.from_time.split(":")[0].length == 1
                                        ? "0" + item.from_time
                                        : item.from_time,
                                    ];
                                  }
                                })}
                                {timeSlot.sort().map((item, index) => (
                                  <>
                                    {index % 3 == 0 ? (
                                      <div className="col-1"></div>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      style={{
                                        backgroundColor:
                                          time === item
                                            ? "#9DC254"
                                            : schedule.some((time) =>
                                                time.appointment_time.split(
                                                  ":"
                                                )[0].length === 1
                                                  ? "0" +
                                                      time.appointment_time ===
                                                    item
                                                  : time.appointment_time ===
                                                    item
                                              ) ||
                                              (currentDate === date &&
                                                (item.split(":")[0] <
                                                  currentHr ||
                                                  (item.split(":")[0] ==
                                                    currentHr &&
                                                    item.split(":")[1] <
                                                      currentMin)))
                                            ? "#E8E8E8"
                                            : "#D7E6E7",
                                        color:
                                          currentDate === date &&
                                          (item.split(":")[0] < currentHr ||
                                            (item.split(":")[0] == currentHr &&
                                              item.split(":")[1] < currentMin))
                                            ? "#fff"
                                            : "",
                                      }}
                                      className="col-3 m-1 avltimelbl text-center"
                                      name="slot"
                                      value={item.from_time}
                                      onClick={() =>
                                        schedule.some((time) =>
                                          time.appointment_time.split(":")[0]
                                            .length === 1
                                            ? "0" + time.appointment_time ===
                                              item
                                            : time.appointment_time === item
                                        ) ||
                                        (currentDate === date &&
                                          (item.split(":")[0] < currentHr ||
                                            (item.split(":")[0] == currentHr &&
                                              item.split(":")[1] < currentMin)))
                                          ? null
                                          : handleClick(item)
                                      }
                                    >
                                      {item.split(":")[0] +
                                        ":" +
                                        item.split(":")[1]}
                                    </div>
                                    {index % 3 == 2 ? (
                                      <div className="col-1"></div>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                ))}
                              </div>
                            </>
                          ) : date && !showDate ? (
                            <div>
                              <h5 className="text-center text-danger">
                                No Available Slots
                              </h5>
                            </div>
                          ) : null}
                        </label>
                      </div>
                    </>

                    <ErrorMessage
                      error={"Time Slot is a required field"}
                      visible={showAppt}
                    />
                    <hr />
                    <div class="row mt-2">
                      <div class="col-sm-4 col-md-4 col-lg-4 mb-1">
                        <div class="squaresel squ">
                          <span class="ml-2 w-wrap">Selected</span>
                        </div>
                      </div>
                      <div class="col-sm-4 col-md-4 col-lg-4 mb-1">
                        <div class="squarefull squ">
                          <span class="ml-2 w-wrap">Booked</span>
                        </div>
                      </div>
                      <div class="col-sm-4 col-md-4 col-lg-4 mb-1">
                        <div class="squareavl squ">
                          <span class="ml-2 w-wrap">Available</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 mb-2">
                      <CustomButton
                        className="btn col-12"
                        type="submit"
                        title="Book Appointment"
                        onClick={handleSubmit}
                      />
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
export default NewAppointment;
