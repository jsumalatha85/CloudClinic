import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorHomePageApi from "../api/doctorHomePage";
import storage from "../auth/storage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomTextInput from "../component/common/CustomTextInput";
import EmptyComponent from "../component/common/EmptyComponent";
import ErrorMessage from "../component/common/ErrorMessage";
import DoctorHome from "./DoctorHome";

function ConsultationHistory(props) {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [date, setDate] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const handleFilterDate = async (event) => {
    try {
      setShowDate(false);
      const doctorID = await storage.getID();
      const value = event.target.value;
      console.log(value);
      if (!value) {
        window.location.reload();
        return;
      }
      if (value <= disablePastDate()) {
        const res = await doctorHomePageApi.filterDate(doctorID, value);
        console.log("Date", res);
        if (res.ok == true) setData(res.data.data);
        else {
          setShowDate(true);
        }
      } else setShowDate(true);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const consultationHistory = async () => {
    try {
      setLoad(true);
      const doctorID = await storage.getID();
      const res = await doctorHomePageApi.consultationHistory(doctorID);
      console.log("Res", res);
      if (res.data.data.length > 0) {
        setData(res.data.data);
        setDate(true);
      }
      setLoad(false);
    } catch (error) {
      console.log("Error", error);
      setLoad(false);
    }
  };

  const handleClick = (name) => {
    setLoad(true);
    const consultationName = name;
    console.log(consultationName);
    setLoad(false);
    navigate("/endconsultation", { state: { consultationName } });
  };

  useEffect(() => {
    consultationHistory();
  }, []);

  return (
    <>
      <DoctorHome />
      {load ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 500, // alignSelf: "",
          }}
        >
          <CustomActivityIndicator
            style={{
              height: 100,
              alignSelf: "center",
            }}
            visible={load}
          />
        </div>
      ) : (
        <section>
          <div className="row no-gutters mt-225 divpd">
            <div className="col-sm-2 col-md-2 col-lg-2"></div>
            <div className="col-sm-12 col-md-10 col-lg-10">
              <div className="row no-gutters mt-2">
                <div className="col-sm-2 col-md-2 col-lg-2"></div>
                <div className="col-sm-6 col-md-6 col-lg-6 mt-4 mb-4">
                  <div className="pd card shadow mt-4">
                    <form>
                      <h4 class="content-heading">Consultation History</h4>
                      <div className="form-group row">
                        <label className="control-label mb-2">Date</label>
                        <div className="col-sm-12 col-md-6 col-lg-5">
                          <CustomTextInput
                            type="date"
                            name="date"
                            className="form-control"
                            max={disablePastDate()}
                            onChange={handleFilterDate}
                          />
                        </div>
                        <ErrorMessage
                          error={"Enter the valid date"}
                          visible={showDate}
                        />
                      </div>
                      {!showDate && date ? (
                        <div id="report" className="table-responsive theight">
                          {data.length > 0 ? (
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Timing</th>
                                  <th>Patient Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.map((item) => {
                                  const date = item.encounter_date.split("-");
                                  const yyyy = date[0];
                                  let mm = date[1];
                                  let dd = date[2];
                                  const selectedDate =
                                    dd + "-" + mm + "-" + yyyy;
                                  // console.log(selectedDate);

                                  const time = item.encounter_time.split(":");
                                  const hh = time[0];
                                  const min = time[1];
                                  const selectedTime = hh + ":" + min;
                                  // console.log(selectedTime);

                                  return (
                                    <tr>
                                      <td>{selectedDate}</td>
                                      <td>{selectedTime}</td>

                                      <td
                                        onClick={() => handleClick(item.name)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {item.patient_name}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          ) : (
                            <EmptyComponent title=" No Consultation History on this date" />
                          )}
                        </div>
                      ) : null}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ConsultationHistory;
