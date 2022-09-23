import React, { useEffect, useState } from "react";
import DoctorRegistration from "./DoctorRegistration";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import moment from "moment";
import doctorRegistration from "../api/doctorRegistration";
import storage from "../auth/storage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomText from "../component/common/CustomText";
import CustomTextInput from "../component/common/CustomTextInput";
import ErrorMessage from "../component/common/ErrorMessage";
import Select from "../component/common/select";
import ShowMessage from "../component/common/ShowMessage";
import close from "../assests/svg/close.svg";
import currency_rupee from "../assests/svg/currency_rupee.svg";
import local_hospital from "../assests/svg/local_hospital.svg";

const days = [
  { id: 1, name: "Sunday" },
  { id: 2, name: "Monday" },
  { id: 3, name: "Tuesday" },
  { id: 4, name: "Wednesday" },
  { id: 5, name: "Thursday" },
  { id: 6, name: "Friday" },
  { id: 7, name: "Saturday" },
];

const durations = [
  { id: 1, name: "15 min" },
  { id: 2, name: "30 min" },
  { id: 3, name: "45 min" },
  { id: 4, name: "60 min" },
];

const freq = [
  { id: "slot15", name: "15 min" },
  { id: "slot30", name: "30 min" },
  { id: "slot45", name: "45 min" },
  { id: "slot60", name: "60 min" },
];

const time = [
  { id: 1, name: "09:00 AM" },
  { id: 2, name: "10:00 AM" },
  { id: 3, name: "11:00 AM" },
  { id: 4, name: "12:00 PM" },
  { id: 5, name: "01:00 PM" },
  { id: 6, name: "02:00 PM" },
  { id: 7, name: "03:00 PM" },
  { id: 8, name: "04:00 PM" },
  { id: 9, name: "05:00 PM" },
  { id: 10, name: "06:00 PM" },
  { id: 11, name: "07:00 PM" },
  { id: 12, name: "08:00 PM" },
  { id: 13, name: "09:00 PM" },
];

function Appointment(props) {
  const navigate = useNavigate();

  const [timingsFrom, setTimingsFrom] = useState();
  const [timingsTo, setTimingsTo] = useState();
  const [timeSlot, setTimeSlot] = useState();
  const [clock, setClock] = useState(false);
  const [hospital, setHospital] = useState();
  const [fees, setFees] = useState();
  const [daysCheck, setDaysCheck] = useState([]);
  const [daysSlot, setDaysSlot] = useState([]);
  const [day, setDay] = useState();
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [duration, setDuration] = useState();
  const [timeSlots, setTimeSlots] = useState([]);
  const [index, setIndex] = useState("");
  const [openModel, setOpenModal] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [showToTime, setShowToTime] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showFromTime, setShowFromTime] = useState(false);
  const [showClinic, setShowClinic] = useState(false);
  const [showFee, setShowFee] = useState(false);
  const [showFeeLimit, setShowFeeLimit] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [showSlot, setShowSlot] = useState(false);
  const [modalDay, setModalDay] = useState([]);
  const [load, setLoad] = useState(false);
  const [slots, setSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [open1, setOpen1] = useState(false);
  const [message1, setMessage1] = useState("");
  const [clinicName, setClinicName] = useState();

  const handleCheckBox = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setShowDay(false);
    // To Check the checkbox
    if (checked) setDaysCheck([...daysCheck, value]);
    // To uncheck the checkbox
    else setDaysCheck(daysCheck.filter((e) => e !== value));
  };

  const handleChangeRadio = (event) => {
    console.log(event.target.value);
    setTimeSlot(event.target.value);
    handleSlot(timingsFrom, timingsTo, event.target.value);
    setShowSlot(false);
  };

  const handleClick = () => {
    setClock(true);
    setShowFromTime(false);
    setShowToTime(false);
    setShowTime(false);
    setTimingsFrom("");
    setTimingsTo("");
  };

  const handleClose = (value, index) => {
    console.log(value, index, slots, "slots");
    slots[index] = slots[index].filter((m) => m !== value);
    console.log(slots);
    setSlots([...slots]);
  };

  const handleCloseDay = (value) => {
    console.log(value);
    const time = modalDay.filter((m) => m !== value);
    setModalDay(time);
  };

  const handleSlot = async (a, b, c) => {
    console.log(a, b, c, "found");

    if (a && b && !c) {
      setShowSlot(true);
      return;
    } else setShowSlot(false);

    let startTime = moment(a, "hh:mm:A");
    let endTime = moment(b, "hh:mm:A");

    console.log(startTime, endTime);
    let obj;
    if (a && b && c)
      if (startTime < endTime) {
        const date = createTimeSlot(a, b, c);
        console.log(slots, "date");
        obj = [...slots, date];
        obj.sort();
        // setDisplaySlots(createTimeSlot(a, b, slotfrequency));
        setSlots([
          ...new Map(obj.map((item) => [JSON.stringify(item), item])).values(),
        ]);
        setTimingsFrom("");
        setTimingsTo("");
        // setTimeSlot("");
        setClock(false);
        setShowToTime(false);

        console.log(obj, "displaySlots");
      } else {
        setShowToTime(true);
        return;
      }
    return obj;
  };

  const createTimeSlot = (fromTime, toTime, slot) => {
    let startTime = moment(fromTime, "hh:mm:A");
    let endTime = moment(toTime, "hh:mm:A");
    let arr = [];
    if (endTime.isBefore(startTime)) {
      endTime.add(1, "day");
    }

    while (startTime <= endTime) {
      console.log(new moment(startTime).format("HH:mm"));
      arr.push(new moment(startTime).format("HH:mm"));
      startTime.add(parseInt(slot), "minutes");
    }
    return arr;
  };

  const handleEditChange = (e) => {
    let days = [...modalDay, e.target.value];
    const obj = [
      ...new Map(days.map((item) => [JSON.stringify(item), item])).values(),
    ];
    setModalDay(obj);
  };

  const handleModalSubmit = () => {
    console.log("ModalSubmitted", fromTime, toTime, modalDay, duration);
    // console.log(timeSlots[0].from_time);
    for (let j = 0; j < modalDay.length; j++)
      for (var i = 0; i < timeSlots.length; i++) {
        if (modalDay[j] === timeSlots[i].day) {
          if (
            fromTime >= timeSlots[i].from_time &&
            fromTime <= timeSlots[i].to_time
          ) {
            console.log("Overlap1");
            setOpen1(true);
            setMessage1("Schedule Overlaps with the existing time slots");
            return;
          }
          if (
            toTime >= timeSlots[i].from_time &&
            toTime <= timeSlots[i].to_time
          ) {
            console.log("Overlap2");
            setOpen1(true);
            setMessage1("Schedule Overlaps with the existing time slots");
            return;
          }
        }
      }
    let startTime = moment(fromTime, "hh:mm:A");
    let endTime = moment(toTime, "hh:mm:A");

    console.log(startTime, endTime);
    let slots;
    if (fromTime && toTime && duration)
      if (startTime < endTime) {
        slots = createTimeSlot(fromTime, toTime, duration);
        console.log(slots);
      }

    let dat = [];
    let date;

    for (let index = 0; index < modalDay.length; index++) {
      for (let index1 = 0; index1 < slots.length - 1; index1++) {
        date = [
          {
            day: modalDay[index],
            from_time: slots[index1],
            to_time: slots[index1 + 1],
          },
        ];
        dat = [...dat, ...date];
      }
    }
    setTimeSlots([...timeSlots, ...dat]);

    setModalDay();
    setFromTime();
    setToTime();
    setOpenModal(false);
    setAddNew(false);
  };

  const handleSubmit = async () => {
    try {
      // console.log(daysCheck, "hospital");
      if (!hospital) {
        setShowClinic(true);
        return;
      } else {
        setShowClinic(false);
      }
      if (!fees) {
        setShowFee(true);
        return;
      } else if (parseInt(fees) < 1) {
        setShowFeeLimit(true);
        return;
      } else setShowFee(false);

      if (timeSlots.length === 0) {
        if (fees === undefined) {
          setShowFee(true);
          return;
        } else setShowFee(false);
        if (daysCheck.length === 0) {
          setShowDay(true);
          return;
        } else setShowDay(false);
        if (!timeSlot) {
          setShowSlot(true);
          return;
        } else setShowSlot(false);
        if (slots.length === 0) {
          setShowFromTime(true);
          return;
        } else setShowFromTime(false);
      }

      setLoad(true);
      const user = await storage.getEmail();

      const doctorID = await storage.getID();

      if (!clinicName) {
        const res = await doctorRegistration.createCompany(hospital);
        console.log(res);

        if (!res.ok) {
          setLoad(false);
          setOpen(true);
          setMessage(
            JSON.parse(JSON.parse(res.data._server_messages)[0]).message
          );
          return;
        }
        const email = await storage.getEmail();
        console.log(email);
        const res1 = await doctorRegistration.userPermission(email, hospital);
        console.log(res1);

        const res2 = await doctorRegistration.getClinicInfo(
          doctorID,
          fees,
          hospital
        );
        console.log(res2);

        setHospital(res.data.data.company_name);
        setFees(fees);
      }

      const res = await doctorRegistration.updateFee(doctorID, fees);
      console.log("Fees", res);

      let dat = [];
      let date;
      for (let i = 0; i < slots.length; i++) {
        for (let index = 0; index < daysCheck.length; index++) {
          for (let index1 = 0; index1 < slots[i].length - 1; index1++) {
            console.log(slots[i][index1], "index");
            date = [
              {
                parenttype: "Practitioner Schedule",
                day: daysCheck[index],
                from_time: slots[i][index1],
                to_time: slots[i][index1 + 1],
                doctype: "Healthcare Schedule Time Slot",
              },
            ];
            dat = [...dat, ...date];
          }
        }
      }

      console.log(dat, date, "dat");
      const scheduleName = await storage.getScheduleName();
      console.log(scheduleName);
      if (scheduleName === null) {
        const user = await storage.getEmail();
        const schedule_name = user + " Schedule";

        await storage.storeScheduleName(schedule_name);
        const res = await doctorRegistration.createSchedule(schedule_name, dat);
        console.log(res, "Response1");

        const res1 = await doctorRegistration.assignSchedule(
          doctorID,
          schedule_name
        );
        console.log(res1, "Res1");
      } else {
        console.log(timeSlots, "Response2");
        // return;
        if (timeSlots.length > 0) {
          const res = await doctorRegistration.createSchedulePut(
            scheduleName,
            timeSlots
          );
          console.log(res, "Response21");
        } else {
          const res = await doctorRegistration.createSchedulePut(
            scheduleName,
            dat
          );
          console.log(res, "Response22");
        }

        const res1 = await doctorRegistration.assignSchedule(
          doctorID,
          scheduleName
        );
        console.log(res1, "Res1");
      }
      setLoad(false);
      navigate("/education");
      window.location.reload();
    } catch (error) {
      console.log("Error1", error);
      setLoad(false);
    }
  };

  const getBasicInformation = async () => {
    try {
      const doctorID = await storage.getID();
      const res = await doctorRegistration.getDetilsBasicInfo(doctorID);
      // await storage.removeScheduleName();
      // console.log(res.data.data.hospital, "Doctor");
      if (res.data.data.hospital !== undefined || "") {
        setHospital(res.data.data.hospital);

        setClinicName(res.data.data.hospital);
        if (res.data.data.op_consulting_charge !== 0)
          setFees(res.data.data.op_consulting_charge);
      }

      const scheduleName = await storage.getScheduleName();

      console.log("ScheduleName", scheduleName);
      if (scheduleName !== null) {
        const res = await doctorRegistration.appointmentInfo(scheduleName);
        console.log("Res", res);
        setTimeSlots(res.data.data.time_slots);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getBasicInformation();
  }, []);

  return (
    <>
      <CustomActivityIndicator
        style={{ height: 100, alignSelf: "center" }}
        visible={load}
      />
      <>
        <DoctorRegistration />
        <section>
          <div className="row no-gutters divpd">
            <div className="row no-gutters">
              <div className="col-sm-2 col-md-2 col-lg-2"></div>
              <div className="col-sm-12 col-md-10 col-lg-10">
                <div className="row no-gutters mt-2">
                  <div className="col-sm-2 col-md-2 col-lg-2"></div>
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <div className="pd card shadow mt-4">
                      <h4 className="content-heading mb-2">
                        Appointment Settings
                      </h4>
                      <ShowMessage view={open} Message={message} />
                      <div className="no-gutters">
                        <div className="form-group row">
                          <h5 className="mb-4">Clinic Information</h5>
                          {/* <ShowMessage view={open} Message={message} /> */}
                          <div className="col-sm-12 col-md-12 col-lg-12">
                            <CustomTextInput
                              type="text"
                              name="clinicname"
                              className="form-control mt-30 indent"
                              placeholder="Clinic Name"
                              value={hospital}
                              icon={<img src={local_hospital} alt="" />}
                              onChange={(e) => {
                                setHospital(e.target.value);
                                setShowClinic(false);
                              }}
                              onClick={() => setOpen(false)}
                            />
                            <ErrorMessage
                              error={"Clinic Name is a required field    "}
                              visible={showClinic}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-12 col-md-12 col-lg-12 mt-2">
                            <CustomTextInput
                              type="number"
                              // inputmode="numeric"
                              maxlength="4"
                              className="form-control mt-30 indent "
                              name="fees"
                              placeholder="Consultation Fees"
                              value={fees}
                              icon={<img src={currency_rupee} alt="" />}
                              onChange={(e) => {
                                e.target.value =
                                  e.target.value.length > 4
                                    ? e.target.value.slice(0, 4)
                                    : e.target.value;
                                setFees(e.target.value);
                                setShowFee(false);
                                setShowFeeLimit(false);
                              }}
                            />
                            <ErrorMessage
                              error={"Consultation Fee is a required field    "}
                              visible={showFee}
                            />
                            <ErrorMessage
                              error={
                                "Consultation Fee must be a positive integer   "
                              }
                              visible={showFeeLimit}
                            />
                          </div>
                        </div>
                      </div>

                      {timeSlots.length >= 1 ? (
                        <>
                          <h5 className="mt-4">
                            Time Slots
                            <span>
                              <button
                                class="addnew"
                                onClick={() => {
                                  setOpenModal(true);
                                  setAddNew(true);
                                  setDay();
                                  setFromTime();
                                  setToTime();
                                  setIndex();
                                  setDuration();
                                }}
                              >
                                + Add New
                              </button>
                            </span>
                          </h5>
                          <div id="report" class="table-responsive theight">
                            <table className="table table-bordered ">
                              <thead>
                                <tr>
                                  <th>Days</th>
                                  <th>From Time</th>
                                  <th>To Time</th>
                                  <th>Update</th>
                                </tr>
                              </thead>
                              <tbody>
                                {timeSlots.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{item.day}</td>
                                      <td>
                                        {item.from_time.split(":")[0] +
                                          ":" +
                                          item.from_time.split(":")[1]}
                                      </td>
                                      <td>
                                        {item.to_time.split(":")[0] +
                                          ":" +
                                          item.to_time.split(":")[1]}
                                      </td>
                                      <td>
                                        <CustomButton
                                          title="Delete"
                                          type="button"
                                          onClick={() => {
                                            setTimeSlots(
                                              timeSlots.filter(
                                                (e) => e !== item
                                              )
                                            );
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="row">
                            <h5 className="mt-3 mb-4">Doctor available days</h5>
                            <div className="avldays">
                              {days.map((item) => {
                                return (
                                  <div className="form-check ">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={item.name}
                                      // id="flexCheckDefault"
                                      onChange={handleCheckBox}
                                    />
                                    <label
                                      className="form-check-label"
                                      // for="flexCheckDefault"
                                    >
                                      {item.name}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                            <ErrorMessage
                              error={"Day is a required field    "}
                              visible={showDay}
                            />
                          </div>
                          <div className="row">
                            <h5 className="mt-3 mb-3">Time Slot Frequency</h5>
                            {freq.map((item) => {
                              return (
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                  <input
                                    type="radio"
                                    name="slot"
                                    id={item.id}
                                    value={item.name}
                                    onClick={handleChangeRadio}
                                  />
                                  <label for="15min" className="ml-25">
                                    {item.name}
                                  </label>
                                </div>
                              );
                            })}
                            <ErrorMessage
                              error={"Time Slot is a required field    "}
                              visible={showSlot}
                            />
                          </div>
                          <h5 class="mt-3 mb-4">
                            Available TimeSlots
                            <span>
                              <button class="addnew" onClick={handleClick}>
                                + Add New
                              </button>
                              <ErrorMessage
                                error={"Available Time is a required field    "}
                                visible={showFromTime}
                              />
                              <ErrorMessage
                                error={
                                  "Choose From Time is lesser than To Time    "
                                }
                                visible={showToTime}
                              />
                            </span>
                          </h5>

                          <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-12">
                              {slots.length > 0 &&
                                slots.map((i, index) => {
                                  return i.map((item) => {
                                    return (
                                      <CustomText
                                        children={item}
                                        className="mb-2 col-sm avltimelbl_time_btn"
                                        icon={
                                          <img
                                            src={close}
                                            alt=""
                                            width={15}
                                            height={15}
                                            onClick={() =>
                                              handleClose(item, index)
                                            }
                                          />
                                        }
                                      />
                                    );
                                  });
                                })}
                            </div>
                            <div>
                              {clock ? (
                                <div className="row">
                                  <div className="col-sm-6 col-md-6 col-lg-4">
                                    <Select
                                      type="text"
                                      id="apptfrom"
                                      name="apptfrom"
                                      className="form-control"
                                      placeholder="From Time"
                                      onChange={(item) => {
                                        setTimingsFrom(item.target.value);
                                        console.log(item.target.value, "item");
                                        handleSlot(
                                          item.target.value,
                                          timingsTo,
                                          timeSlot
                                        );
                                      }}
                                      options={time}
                                    />
                                  </div>
                                  <div className="col-sm-6 col-md-6 col-lg-4">
                                    <Select
                                      type="text"
                                      id="apptto"
                                      name="apptto"
                                      className="form-control"
                                      placeholder="To Time"
                                      onChange={(item) => {
                                        setTimingsTo(item.target.value);
                                        console.log(
                                          item.target.value,
                                          timingsFrom,
                                          "item"
                                        );
                                        handleSlot(
                                          timingsFrom,
                                          item.target.value,
                                          timeSlot
                                        );
                                      }}
                                      options={time}
                                    />
                                  </div>
                                  <ErrorMessage
                                    error={"Select both from Time and to Time "}
                                    visible={showTime}
                                  />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="form-group row mt-4">
                        <CustomButton
                          className="btn mt-4 col-11 center"
                          type="submit"
                          title=" Next"
                          onClick={handleSubmit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <>
                  <Modal
                    show={openModel}
                    onHide={() => {
                      setOpenModal(false);
                      setAddNew(false);
                      setOpen1(false);
                    }}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Appointment Slots</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {addNew ? (
                        <div className="row">
                          <div className="col-sm-6 col-md-6 col-lg-6 dropdown">
                            {/* <CustomText>Days</CustomText> */}
                            <Select
                              type="text"
                              name="days"
                              id="days"
                              className="form-control"
                              options={days}
                              value=""
                              onChange={handleEditChange}
                              onClick={() => setOpen1(false)}
                              placeholder="Select a Day"
                            />
                            {modalDay.length > 0
                              ? modalDay.map((item) => {
                                  return (
                                    <CustomText
                                      className="mb-2 avltimelbl1"
                                      icon={
                                        <img
                                          src={close}
                                          alt=""
                                          onClick={() => handleCloseDay(item)}
                                        />
                                      }
                                    >
                                      {item}
                                    </CustomText>
                                  );
                                })
                              : null}
                          </div>
                          <div className="col-sm-6 col-md-6 col-lg-6">
                            {/* <CustomText> Duration</CustomText> */}
                            <Select
                              type="text"
                              name="slot"
                              id="slot"
                              className="form-control"
                              options={durations}
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              onClick={() => setOpen1(false)}
                              placeholder="Duration"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-sm-6 col-md-6 col-lg-6">
                            <CustomText>Days</CustomText>
                            <Select
                              type="text"
                              name="days"
                              id="days"
                              className="form-control"
                              options={days}
                              value={day}
                              onChange={(e) => setDay(e.target.value)}
                              onClick={() => setOpen1(false)}
                              placeholder="Select a  Day"
                            />
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="col-sm-6 col-md-6 col-lg-4">
                          <CustomText>From Time</CustomText>
                          <input
                            type="time"
                            id="apptfrom"
                            name="apptfrom"
                            placeholder="Select a Time"
                            value={fromTime}
                            onChange={(e) => setFromTime(e.target.value)}
                            onClick={() => setOpen1(false)}
                          />
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-4">
                          <CustomText>To Time</CustomText>
                          <input
                            type="time"
                            id="apptto"
                            name="apptto"
                            placeholder="Select a Time"
                            value={toTime}
                            onClick={() => setOpen1(false)}
                            onChange={(e) => {
                              setToTime(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <CustomButton
                        className="btn"
                        title="Add"
                        onClick={handleModalSubmit}
                      />
                    </Modal.Footer>
                    <ShowMessage view={open1} Message={message1} />
                  </Modal>
                </>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}

export default Appointment;
