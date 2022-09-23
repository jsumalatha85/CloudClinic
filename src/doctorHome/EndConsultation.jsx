import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import doctorHomePageApi from "../api/doctorHomePage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomForm from "../component/common/CustomForm";
import DoctorHome from "./DoctorHome";
import diagnosis from "../assests/svg/diagnosis-blue.svg";
import gender from "../assests/svg/female-blue.svg";
import lab from "../assests/svg/lab-blue.svg";
import patientnotes from "../assests/svg/patient-notes-blue.svg";
import person from "../assests/svg/person.svg";
import personage from "../assests/svg/age-blue.svg";
import presmedicine from "../assests/svg/prescribe-medicine-blue.svg";
import symptom from "../assests/svg/symptoms-blue.svg";
import bloodpressure from "../assests/svg/bp.svg";
import patientweight from "../assests/svg/weight.svg";

function EndConsultation(props) {
  const location = useLocation();

  const [data, setData] = useState();
  const [age, setAge] = useState();
  const [symptoms, setSymptoms] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [labTest, setLabTest] = useState([]);
  const [patientNotes, setPatientNotes] = useState();
  const [notes, setNotes] = useState();
  const [weight, setWeight] = useState();
  const [bp, setBP] = useState();
  const [load, setLoad] = useState(false);

  const consultationSummary = async () => {
    try {
      setLoad(true);
      const consultationName = location.state.consultationName;
      const res = await doctorHomePageApi.consultationSummary(consultationName);
      // console.log(res.data.data.notes_for_patient);
      const dob = res.data.data.dob;
      const age = moment().diff(dob, "years");
      // console.log(res.data.data.symptoms);
      setData(res.data.data);
      setAge(age);
      setWeight(res.data.data.weight);
      setBP(res.data.data.bp);
      setSymptoms(res.data.data.symptoms);
      setDrugs(res.data.data.drug_prescription);
      setLabTest(res.data.data.lab_test_prescription);
      setPatientNotes(res.data.data.notes_for_patient);
      setNotes(res.data.data.notes_for_doctor);
      setLoad(false);
    } catch (error) {
      console.log("Error", error);
      setLoad(false);
    }
  };

  useEffect(() => {
    consultationSummary();
  }, []);

  return (
    <>
      <CustomActivityIndicator
        style={{ height: 100, alignSelf: "center" }}
        visible={load}
      />
      <DoctorHome />
      <section>
        {data ? (
          <div className="row no-gutters mt-225 divpd">
            <div className="col-sm-2 col-md-2 col-lg-2"></div>
            <div className="col-sm-12 col-md-10 col-lg-10">
              <div className="row no-gutters mt-2">
                <div className="col-sm-2 col-md-2 col-lg-2"></div>
                <div className="col-sm-6 col-md-6 col-lg-6 mt-4 mb-4">
                  <CustomForm>
                    <div className="pd card shadow mt-4">
                      <h4 class="content-heading">Consultation Summary</h4>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={person} atl="" className="mt-2" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Patient Name
                          </label>
                          <br />
                          <label class="control-label">
                            {data.patient_name}
                          </label>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={personage} atl="" className="mt-2" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Patient Age
                          </label>
                          <br />
                          <label class="control-label">{age}</label>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={gender} atl="" className="mt-2" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Gender
                          </label>
                          <br />
                          <label class="control-label">
                            {data.patient_sex}
                          </label>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={patientweight} atl="" className="mt-2" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Weight
                          </label>
                          <div>{data.weight}</div>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={bloodpressure} atl="" className="mt-2" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">BP</label>
                          <div>{data.bp}</div>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={symptom} atl="" className="mt-2" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Symptoms
                          </label>
                          <br />
                          {symptoms.map((item) => {
                            return <li>{item.complaint}</li>;
                          })}
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={diagnosis} atl="" className="mt-2" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Diagnosis
                          </label>
                          <br />
                          <label class="control-label">
                            {data.diagnosis[0].diagnosis}
                          </label>
                        </div>
                      </div>
                      <h5>For Doctors Only</h5>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={presmedicine} atl="" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Prescription
                          </label>
                          <div>
                            {drugs.map((item) => {
                              return <li>{item.drug_name}</li>;
                            })}
                          </div>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={lab} atl="" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Lab Test
                          </label>
                          <div>
                            {labTest.map((item) => {
                              return (
                                <li className="control-label">
                                  {item.lab_test_name}
                                </li>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={patientnotes} atl="" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">
                            Patient Notes
                          </label>
                          <div>{data.notes_for_patient}</div>
                        </div>
                      </div>
                      <div class="form-group row mt-2">
                        <div class="col-1" style={{ width: "40px" }}>
                          <img src={patientnotes} atl="" />
                        </div>
                        <div class="col-10">
                          <label class="control-label con_sum_lbl">Notes</label>
                          <div>{data.notes_for_doctor}</div>
                        </div>
                      </div>
                      {/* <div className="text-center">
                        <Link to="/newpatient" className="btn col-12 mt-4">
                          Book Appointment
                        </Link>
                      </div> */}
                    </div>
                  </CustomForm>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

export default EndConsultation;
