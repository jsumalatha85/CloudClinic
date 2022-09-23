import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import doctorHomePageApi from "../api/doctorHomePage";
import CustomButton from "../component/common/CustomButton";
import Select from "../component/common/select";
import DoctorHome from "./DoctorHome";

let resdata = [];

function PatientEncounter(props) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [patient, setPatient] = useState([]);
  const [data, setData] = useState([]);
  const [date, setDate] = useState();

  const handleFilterPatient = async (event) => {
    try {
      const value = event.target.value;
      console.log(value);
      setInputs(value);
      const res = await doctorHomePageApi.patientEncounterFilter(value);
      console.log("Res", res.data.data);
      setData(res.data.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleFilterDate = async (event) => {
    const value = event.target.value;
    console.log(value);
    setDate(value);
  };

  const patientDetails = async () => {
    try {
      const res = await doctorHomePageApi.patientEncounter();
      console.log("Res", res.data.data);
      resdata = res.data.data;
      setPatient(resdata);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleClick = () => {
    navigate("/startconsultation", {
      state: { patient: inputs, date: date },
    });
  };

  useEffect(() => {
    patientDetails();
  }, []);

  return (
    <>
      <DoctorHome />
      <section>
        <div className="row">
          <div className="col-sm-12 col-md-12-col-lg-12 mt-225">
            <div className="divpd ">
              <h5 class="text-center">Patient Encounter</h5>
              <form>
                <div className="row divpd">
                  <div className="col-sm-12 col-md-4 col-lg-4"></div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group row">
                      <label className="control-label">Date</label>
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <input
                          type="date"
                          name="date"
                          className="form-control"
                          onChange={handleFilterDate}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label">Select Patient</label>
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <Select
                          type="text"
                          name="patient"
                          id="patient"
                          className="form-select form-select-lg mb-3"
                          aria-label=".form-select-lg example"
                          options={resdata}
                          value={inputs}
                          onChange={handleFilterPatient}
                          placeholder="Select Patient"
                        />
                      </div>
                    </div>
                    {data.length > 0 ? (
                      <div>
                        <div className="row divpd">
                          <div className="col-sm-2 col-md-2 col-lg-2">
                            <label className="control-label">First Name:</label>
                          </div>
                          <div className="col-sm-10 col-md-10 col-lg-10">
                            <label className="control-label">
                              {data[0].patient_name}
                            </label>
                          </div>
                        </div>

                        <div className="row divpd">
                          <div className="col-sm-2 col-md-2 col-lg-2">
                            <label className="control-label">Gender:</label>
                          </div>
                          <div className="col-sm-10 col-md-10 col-lg-10">
                            <label className="control-label">
                              {data[0].patient_sex}
                            </label>
                          </div>
                        </div>
                        <div className="row divpd">
                          <div className="col-sm-2 col-md-2 col-lg-2">
                            <label className="control-label">Age:</label>
                          </div>
                          <div className="col-sm-10 col-md-10 col-lg-10">
                            <label className="control-label">
                              {data[0].patient_age}
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <Link
                        to="/consultationhistory"
                        className="btn col-sm-11 mt-4"
                      >
                        Previous Consultation
                      </Link>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <CustomButton
                        title="Start Consultation"
                        onClick={handleClick}
                        className="btn col-sm-11 mt-4"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PatientEncounter;
