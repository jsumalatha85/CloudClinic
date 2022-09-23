import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import moment from "moment";
import { Modal } from "react-bootstrap";
import doctorHomePageApi from "../api/doctorHomePage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomText from "../component/common/CustomText";
import ErrorMessage from "../component/common/ErrorMessage";
import Select from "../component/common/select";
import DoctorHome from "./DoctorHome";
import assignment from "../assests/svg/assignment.svg";
import bloodpressure from "../assests/svg/bp.svg";
import close from "../assests/svg/close.svg";
import gender from "../assests/svg/female-blue.svg";
import patientweight from "../assests/svg/weight.svg";
import person from "../assests/svg/person.svg";
import personage from "../assests/svg/age-blue.svg";

function StartConsultation(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [symptom, setSymptom] = useState([]);
  const [diag, setDiagnosis] = useState([]);
  const [symptomSel, setSymptomSel] = useState([]);
  const [diagnosisSel, setDiagnosisSel] = useState([]);
  const [drugs, setMedi] = useState([]);
  const [medName, setMedName] = useState();
  const [medCode, setMedCode] = useState();
  const [genericName, setGenericName] = useState();
  const [consump, setConsump] = useState();
  const [intakes, setIntake] = useState();
  const [period, setPeriod] = useState();
  const [dosageForm, setDosageForm] = useState("Tablets");
  const [load, setLoad] = useState(false);
  const [labtestName, setLabTestName] = useState();
  const [intakeLab, setIntakeLab] = useState();
  const [comments, setComments] = useState();
  const [data, setData] = useState([]);
  const [consumption, setConsumption] = useState([]);
  const [periodOfDays, setPeriodOfDays] = useState([]);
  const [labTestCode, setLabTestCode] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [reportFiles, setReportFiles] = useState([]);
  const [drugsPrescription, setDrugsPrescription] = useState([]);
  const [labTestPrescription, setlabTestPrescription] = useState([]);
  const [labList, setlabList] = useState([]);
  const [showMed, setShowMed] = useState(false);
  const [lab, setLabTest] = useState([]);
  const [show, setShow] = useState(false);
  const [showSymptom, setShowSymptom] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showMedicine, setShowMedicine] = useState(false);
  const [showConsump, setShowConsump] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [showIntakeLab, setShowIntakeLab] = useState(false);
  const [showReportError, setShowReportError] = useState(false);
  const [showFileError, setShowFileError] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [prescription, setPresciption] = useState(false);
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState();
  const [report, setReport] = useState();
  const [patientNotes, setPatientNotes] = useState();
  const [doctorNotes, setDoctorNotes] = useState();
  const [weight, setWeight] = useState();
  const [bp, setBP] = useState();
  const [openModel, setOpenModal] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [consultationId, setConsultationId] = useState("");
  const [summary, setSummary] = useState("");

  const intake = [
    { id: 1, name: "Before Food" },
    { id: 2, name: "After Food" },
  ];

  const handleSelectSymptom = (events) => {
    let symptoms = [...symptomSel, { complaint: events.target.value }];
    const obj = [
      ...new Map(symptoms.map((item) => [JSON.stringify(item), item])).values(),
    ];
    // console.log(obj);
    setSymptomSel(obj);
    setShowSymptom(false);
  };

  const handleCloseSymptom = (item) => {
    const data = symptomSel.filter((m) => m !== item);
    setSymptomSel(data);
  };

  const handleSelectDiagnosis = (events) => {
    setDiagnosisSel([...diagnosisSel, { diagnosis: events.target.value }]);
    console.log([...diagnosisSel, { diagnosis: events.target.value }]);
    setShowDiagnosis(false);
  };

  const handleSearchMedicine = async (e) => {
    setMedi([]);
    const value = e.target.value;
    console.log(value);
    if (value.length >= 3) {
      const res = await doctorHomePageApi.searchMedicine(value);
      console.log(res.data.data);
      setMedi(res.data.data);
      setShowMed(true);
    }
    setMedName();
    setShowMedicine(false);
  };

  const handleMedicine = async () => {
    console.log(
      medName,
      medCode,
      genericName,
      consump,
      intakes,
      period,
      dosageForm
    );
    if (!medName) {
      setShowMedicine(true);
      return;
    } else setShowMedicine(false);
    if (!consump) {
      setShowConsump(true);
      return;
    } else setShowConsump(false);
    if (!intakes) {
      setShowIntake(true);
      return;
    } else setShowIntake(false);
    if (!period) {
      setShowPeriod(true);
      return;
    } else setShowPeriod(false);

    setMedicines([
      ...medicines,
      {
        id: medicines.length + 1,
        drug_code: medCode,
        drug_name: medName,
        genericName: genericName,
        dosage: consump,
        intake: intakes,
        period: period,
        dosage_form: dosageForm,
      },
    ]);
    setDrugsPrescription([
      ...drugsPrescription,
      {
        drug_code: medCode,
        drug_name: medName,
        dosage: consump,
        period: period,
        dosage_form: dosageForm,
      },
    ]);
    setMedName("");
    setGenericName("");
    setConsump("");
    setIntake("");
    setPeriod("");
    setPresciption(false);
  };

  const handleSearchLab = async (e) => {
    setLabTest([]);
    const value = e.target.value;
    if (value.length >= 3) {
      const res = await doctorHomePageApi.searchLab(value);
      console.log(res);
      setLabTest(res.data.data);
      setShow(true);
    }
    setLabTestName();
    setShowLab(false);
  };

  const handleLabTest = () => {
    if (!labtestName) {
      setShowLab(true);
      return;
    } else setShowLab(false);
    if (!intakeLab) {
      setShowIntakeLab(true);
      return;
    } else setShowIntakeLab(false);
    if (!comments) {
      setShowComments(true);
      return;
    } else setShowComments(false);

    setlabList([
      ...labList,
      {
        id: labList.length + 1,
        lab_test_code: labTestCode,
        lab_test_name: labtestName,
        period: intakeLab,
        lab_test_comment: comments,
      },
    ]);

    setlabTestPrescription([
      ...labTestPrescription,
      {
        lab_test_code: labTestCode,
        lab_test_name: labtestName,
        lab_test_comment: comments,
      },
    ]);
    setLabTestName("");
    setIntakeLab("");
    setComments("");
  };

  const handleLabReport = () => {
    if (!report) {
      setShowReportError(true);
      return;
    } else setShowReportError(false);
    if (!fileName) {
      setShowFileError(true);
      return;
    } else setShowFileError(false);
    setReportFiles([
      ...reportFiles,
      {
        id: reportFiles.length + 1,
        // file: URL.createObjectURL(fileName),
        name: report,
        fileName: fileName,
        image: image,
      },
    ]);
    console.log("reportFiles", reportFiles);
    setReport("");
    document.getElementById("reportFile").value = null;
    setFileName("");
    return;
  };

  const handleImage = (e) => {
    console.log(e.target.value);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
        console.log(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleDeleteReport = (item) => {
    console.log(item);
    const data = reportFiles.filter((m) => m !== item);
    console.log(data);
    setReportFiles(data);
  };
  // const Myelement = ({ item }) => {
  //   return (
  //     <div
  //       dangerouslySetInnerHTML={{
  //         __html: item,
  //       }}
  //     ></div>
  //   );
  // };

  const handleClose = () => {
    setOpenModal(false);
  };
  const handleConsultationHistory = async (id, subject) => {
    //console.log("subject--", subject);
    setSummary(
      <div
        dangerouslySetInnerHTML={{
          __html: subject,
        }}
      ></div>
    );
    setOpenModal(true);
  };
  const getPatientDetails = async () => {
    setLoad(true);
    if (location.state === null) {
      setLoad(false);
      navigate("/upcomingappointment");
    }
    console.log(location.state, "AppointmentID");
    const appointmentID = location.state.appointmentID;

    const res = await doctorHomePageApi.getPatientAppointment(appointmentID);
    console.log("Patient", res);
    setData(res.data.data);
    const res1 = await doctorHomePageApi.getConsumption();
    console.log("Consumption", res1.data.data);
    setConsumption(res1.data.data);
    const res2 = await doctorHomePageApi.getDuration();
    console.log("duration", res2.data.data);
    setPeriodOfDays(res2.data.data);

    //    console.log("patient--", res.data.data);
    const resPatientRecord = await doctorHomePageApi.getPatientRecord(
      res.data.data[0].patient
    );
    setConsultationHistory(resPatientRecord.data.data);
    //console.log("resPatientRecord----", resPatientRecord.data.data);
    setLoad(false);
  };

  const symptoms = async () => {
    const res = await doctorHomePageApi.selectSymptoms();
    console.log("Res", res.data.data);
    setSymptom(res.data.data);
  };

  const diagnosis = async () => {
    const res = await doctorHomePageApi.selectDiagnosis();
    console.log("Res", res.data.data);
    setDiagnosis(res.data.data);
  };

  const handleSubmit = async () => {
    console.log(image, fileName);
    if (symptomSel.length < 1) {
      setShowSymptom(true);
      return;
    } else setShowSymptom(false);
    if (diagnosisSel.length < 1) {
      setShowDiagnosis(true);
      return;
    } else setShowDiagnosis(false);
    if (medicines.length < 1) {
      setPresciption(true);
      return;
    } else setPresciption(false);

    setLoad(true);
    console.log(data, symptomSel, diagnosisSel);
    const patient = data[0].patient;
    const patient_name = data[0].patient_name;
    const sex = data[0].patient_sex;
    const dob = data[0].dob;
    const age = moment().diff(dob, "years");
    console.log(age, dob);
    const practitioner = data[0].practitioner;
    const practitioner_name = data[0].practitioner_name;
    const appointmentID = location.state.appointmentID;

    const res = await doctorHomePageApi.patientConsultation(
      appointmentID,
      patient,
      patient_name,
      sex,
      age,
      weight,
      bp,
      practitioner,
      practitioner_name,
      symptomSel,
      diagnosisSel,
      drugsPrescription,
      labTestPrescription,
      doctorNotes,
      patientNotes
    );
    console.log("Response", res.data.data);
    const consultationName = res.data.data.name;

    const res1 = await doctorHomePageApi.savePatientConsultation(
      consultationName
    );
    console.log("Res1", res1.data.data.name);

    const res2 = await doctorHomePageApi.getRecord(res1.data.data.name);
    console.log(res2.data.data[0].name);

    if (reportFiles.length > 0) {
      reportFiles.map(async (item) => {
        console.log("name--", item.name);
        const res3 = await doctorHomePageApi.attachRecord(
          res2.data.data[0].name,
          item.name,
          item.image
        );
        console.log(res3);
      });
    }
    setTimeout(() => {
      navigate("/endconsultation", { state: { consultationName } });
      window.location.reload();
      setLoad(false);
    }, 3000);
  };

  useEffect(() => {
    getPatientDetails();
    symptoms();
    diagnosis();
  }, []);

  return (
    <>
      <CustomActivityIndicator
        style={{
          height: 100,
          alignSelf: "center",
        }}
        visible={load}
      />
      <>
        <DoctorHome />
        <section>
          <div className="row no-gutters mt-225 divpd">
            <div className="row no-gutters">
              <div className="col-sm-2 col-md-2 col-lg-2"></div>
              <div className="col-sm-12 col-md-10 col-lg-10">
                <div className="row no-gutters mt-2">
                  <div className="col-sm-2 col-md-2 col-lg-2"></div>
                  <div className="col-sm-8 col-md-8 col-lg-8 mt-4 mb-4">
                    <div className="pd card shadow mt-4">
                      <h4 class="content-heading">Patient Consultation</h4>
                      {data.length > 0 && (
                        <div className="row">
                          <div className="col-sm-6 col-md-6 col-lg-6 ">
                            <div className="form-group row">
                              <div class="col-2" style={{ width: "50px" }}>
                                <img src={person} atl="" />
                              </div>
                              <div class="col-9">
                                <label class="control-label con_sum_lbl">
                                  Patient Name
                                </label>
                                <br />
                                <label class="control-label">
                                  {data[0].patient_name}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div class="col-2" style={{ width: "50px" }}>
                                <img src={personage} atl="" />
                              </div>
                              <div class="col-9">
                                <label class="control-label con_sum_lbl">
                                  Patient Age
                                </label>
                                <br />
                                <label class="control-label">
                                  {moment().diff(data[0].dob, "years")}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div class="col-2" style={{ width: "50px" }}>
                                <img src={gender} atl="" />
                              </div>
                              <div class="col-9">
                                <label class="control-label con_sum_lbl">
                                  Gender
                                </label>
                                <br />
                                <label class="control-label">
                                  {data[0].patient_sex}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div class="col-2" style={{ width: "50px" }}>
                                <img
                                  src={patientweight}
                                  atl=""
                                  className="mt-2"
                                />
                              </div>
                              <div class="col-6">
                                <input
                                  className="col-12 border mt-2 indent"
                                  type="number"
                                  name="Weight"
                                  value={weight}
                                  onChange={(e) => {
                                    e.target.value =
                                      e.target.value.length > 3
                                        ? e.target.value.slice(0, 3)
                                        : e.target.value;
                                    setWeight(e.target.value);
                                  }}
                                  placeholder="Weight"
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <div class="col-2" style={{ width: "50px" }}>
                                <img
                                  src={bloodpressure}
                                  atl=""
                                  className="mt-2"
                                />
                              </div>
                              <div class="col-6">
                                <input
                                  className="col-12 border mt-2 indent "
                                  type="text"
                                  name="Blood Pressure"
                                  // onChange={fixMaxLength}
                                  value={bp}
                                  onChange={(e) => {
                                    e.target.value =
                                      e.target.value.length > 7
                                        ? e.target.value.slice(0, 7)
                                        : e.target.value;
                                    setBP(e.target.value);
                                  }}
                                  placeholder="BP"
                                />
                              </div>
                            </div>
                          </div>

                          {/* <div className="col-sm-6 col-md-6 col-lg-6 ">
        
                            <div className="row">
                              <div className="col-4">
                                <label class=" control-label con_sum_lbl">
                                  Patient Name
                                </label>
                              </div>
                              <div className="col-1 con_sum_lbl"> :</div>
                              <div className="col-5">
                                <CustomText class="control-label con_sum_lbl">
                                  {data[0].patient_name}
                                </CustomText>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4 col-md-4 col-lg-4">
                                <label class="control-label con_sum_lbl">
                                  Patient Age
                                </label>
                              </div>
                              <div className="col-sm-1 con_sum_lbl"> :</div>
                              <div className="col-sm-5 col-md-5 col-lg-5">
                                <CustomText class="control-label con_sum_lbl">
                                  {moment().diff(data[0].dob, "years")}
                                </CustomText>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4 col-md-4 col-lg-4">
                                <label class="control-label con_sum_lbl">
                                  Gender
                                </label>
                              </div>
                              <div className="col-sm-1 con_sum_lbl"> :</div>
                              <div className="col-sm-5 col-md-5 col-lg-5">
                                <CustomText class="control-label con_sum_lbl">
                                  {data[0].patient_sex}
                                </CustomText>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4 col-md-4 col-lg-4">
                                <label class="control-label con_sum_lbl">
                                  Weight
                                </label>
                              </div>
                              <div className="col-sm-1 con_sum_lbl"> :</div>
                              <div className="col-sm-5 col-md-5 col-lg-5">
                                <CustomText class="control-label con_sum_lbl">
                                  <input
                                    className="col-sm-12 col-md-12 col-lg-12 border"
                                    type="number"
                                    name="Weight"
                                    value={weight}
                                    onChange={(e) => {
                                      e.target.value =
                                        e.target.value.length > 3
                                          ? e.target.value.slice(0, 3)
                                          : e.target.value;
                                      setWeight(e.target.value);
                                    }}
                                    placeholder="Weight"
                                  />
                                </CustomText>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4 col-md-4 col-lg-4">
                                <label class="control-label con_sum_lbl">
                                  Blood Pressure
                                </label>
                              </div>
                              <div className="col-sm-1 con_sum_lbl"> :</div>
                              <div className="col-sm-5 col-md-5 col-lg-5">
                                <CustomText class="control-label con_sum_lbl">
                                  <input
                                    className="col-sm-12 col-md-12 col-lg-12 border"
                                    type="text"
                                    name="Blood Pressure"
                                    // onChange={fixMaxLength}
                                    value={bp}
                                    onChange={(e) => {
                                      e.target.value =
                                        e.target.value.length > 7
                                          ? e.target.value.slice(0, 7)
                                          : e.target.value;
                                      setBP(e.target.value);
                                    }}
                                    placeholder="BP"
                                  />
                                </CustomText>
                              </div>
                            </div>
                          </div> */}
                          <div className="col-sm-6 col-md-6 col-lg-6 ">
                            <div className="App">
                              <h5>Consultation History</h5>
                            </div>
                            <div className="row col-12 mt-4">
                              {consultationHistory.length > 0 ? (
                                <div className="row col-12 table-responsive historyHeight">
                                  {consultationHistory.map((item) => {
                                    return (
                                      <div
                                        className="col-sm-4 col-md-4 col-lg-4 border pointer App gridHeight"
                                        onClick={() => {
                                          handleConsultationHistory(
                                            item.name,
                                            item.subject
                                          );
                                        }}
                                      >
                                        {item.communication_date}
                                        <br />
                                        <button
                                          class="addnew"
                                          onClick={() => {
                                            handleConsultationHistory(
                                              item.name,
                                              item.subject
                                            );
                                          }}
                                        >
                                          View
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                "No Previous history available"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="form-group mt-4">
                        <Select
                          type="text"
                          name="symptom"
                          id="symptom"
                          className="form-control"
                          options={symptom}
                          value={symptomSel}
                          placeholder="Select Symptoms"
                          onChange={handleSelectSymptom}
                          error={"Symptom is a required field"}
                          visible={showSymptom}
                        />
                        {symptomSel.length > 0
                          ? symptomSel.map((item) => {
                              return (
                                <CustomText
                                  className="mb-2 avltimelbl1"
                                  icon={
                                    <img
                                      src={close}
                                      alt=""
                                      onClick={() => handleCloseSymptom(item)}
                                    />
                                  }
                                >
                                  {item.complaint}
                                </CustomText>
                              );
                            })
                          : null}
                      </div>

                      <div className="form-group mt-2">
                        <Select
                          type="text"
                          name="diagnosis"
                          id="diagnosis"
                          className="form-control"
                          options={diag}
                          // value={diagnosisSel}
                          placeholder="Select Diagnosis"
                          onChange={handleSelectDiagnosis}
                          error={"Diagnosis is a required field"}
                          visible={showDiagnosis}
                        />
                      </div>

                      <h5 class=" ">Prescribed Medicines</h5>
                      <ErrorMessage
                        error={"Prescribed Medicine is a required field    "}
                        visible={prescription}
                      />
                      <div className="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 mt-2">
                          <input
                            type="text"
                            name="medicine"
                            id="medicine"
                            class="form-control"
                            value={medName}
                            onChange={handleSearchMedicine}
                            placeholder="Medicine"
                          />
                          <div className="container-sm cstmborder">
                            {showMed &&
                              drugs.map((item) => {
                                return (
                                  <CustomText
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      setMedName(item.item_name);
                                      setMedCode(item.name);
                                      setGenericName(item.generic_name);
                                      setShowMed(false);
                                    }}
                                  >
                                    {item.item_name}
                                  </CustomText>
                                );
                              })}
                          </div>
                          <ErrorMessage
                            error={"Medicine is a required field    "}
                            visible={showMedicine}
                          />
                        </div>

                        <div class="col-sm-12 col-md-6 col-lg-6 mt-2">
                          <input
                            type="text"
                            name="generic"
                            id="generic"
                            class="form-control  col-sm-12 col-md-6 col-lg-6"
                            // options={resdata}
                            value={genericName}
                            // onChange={handleSearchMedicine}
                            placeholder="Generic Name"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-3">
                          <Select
                            type="text"
                            name="consumption"
                            id="consumption"
                            className="form-control"
                            options={consumption}
                            value={consump}
                            onChange={(e) => {
                              setConsump(e.target.value);
                              setShowConsump(false);
                            }}
                            placeholder="Consumption"
                          />
                          <ErrorMessage
                            error={"Consumption is a required field    "}
                            visible={showConsump}
                          />
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-3">
                          <Select
                            type="text"
                            name="intake"
                            id="intake"
                            className="form-control"
                            options={intake}
                            value={intakes}
                            onChange={(e) => {
                              setIntake(e.target.value);
                              setShowIntake(false);
                            }}
                            placeholder="Before / After"
                          />
                          <ErrorMessage
                            error={"Intake is a required field"}
                            visible={showIntake}
                          />
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-3">
                          <Select
                            type="text"
                            name="period"
                            id="period"
                            class="form-control"
                            options={periodOfDays}
                            value={period}
                            onChange={(e) => {
                              setPeriod(e.target.value);
                              setShowPeriod(false);
                            }}
                            placeholder="Period"
                          />
                          <ErrorMessage
                            error={"Period is a required field "}
                            visible={showPeriod}
                          />
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-4">
                          <button
                            type="button"
                            class="addnew"
                            onClick={handleMedicine}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      {medicines.length > 0 && (
                        <div id="report" class="mt-2 table-responsive">
                          <table className="table table-bordered col-sm-12">
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Medicine</th>
                                <th>Generic Name</th>
                                <th>Consumption</th>
                                <th>Before / After</th>
                                <th>Period</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicines.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.drug_name}</td>
                                    <td>{item.genericName}</td>
                                    <td>{item.dosage}</td>
                                    <td>{item.intake}</td>
                                    <td>{item.period}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <h5 class="mt-3">Lab Tests</h5>
                      <div className="row">
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                          <input
                            type="text"
                            name="lab"
                            id="lab"
                            class="form-control"
                            value={labtestName}
                            onChange={handleSearchLab}
                            placeholder="Lab Tests"
                          />

                          <div className="container-sm cstmborder">
                            {show &&
                              lab.map((item) => {
                                return (
                                  <CustomText
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      setLabTestName(item.lab_test_name);
                                      setLabTestCode(item.name);
                                      setShow(false);
                                    }}
                                  >
                                    {item.lab_test_name}
                                  </CustomText>
                                );
                              })}
                          </div>
                          <ErrorMessage
                            error={"Lab is a required field "}
                            visible={showLab}
                          />
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                          <Select
                            type="text"
                            name="consumption"
                            id="consumption"
                            class="form-control"
                            options={intake}
                            value={intakeLab}
                            onChange={(e) => {
                              setIntakeLab(e.target.value);
                              setShowIntakeLab(false);
                            }}
                            placeholder="Before/After"
                          />
                          <ErrorMessage
                            error={"Intake is a required field "}
                            visible={showIntakeLab}
                          />
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                          <input
                            type="text"
                            name="patient"
                            id="patient"
                            class="form-control"
                            // options={resdata}
                            value={comments}
                            onChange={(e) => {
                              setComments(e.target.value);
                              setShowComments(false);
                            }}
                            placeholder="Comments"
                          />
                          <ErrorMessage
                            error={"Comment is a required field "}
                            visible={showComments}
                          />
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-3">
                          <button
                            type="button"
                            class="addnew"
                            onClick={handleLabTest}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      {labList.length > 0 && (
                        <div id="report" class="mt-3 mb-2 table-responsive">
                          <table className="table table-bordered" width="50%">
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Lab Tests</th>
                                <th>Before / After</th>
                                <th>Comments</th>
                              </tr>
                            </thead>
                            <tbody>
                              {labList.map((item) => {
                                return (
                                  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.lab_test_name}</td>
                                    <td>{item.period}</td>
                                    <td>{item.lab_test_comment}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <h5 class="mt-3">Lab Test Reports</h5>
                      <div className="row form-group mt-2">
                        <div class="col-sm-12 col-md-4 col-lg-4 mt-2">
                          <input
                            type="text"
                            name="report"
                            id="report"
                            class="form-control"
                            value={report}
                            placeholder="Report Name"
                            onChange={(e) => {
                              setReport(e.target.value);
                              setShowReportError(false);
                            }}
                          />
                          <ErrorMessage
                            error={"Lab report name is required"}
                            visible={showReportError}
                          />
                        </div>
                        <div class="col-sm-12 col-md-5 col-lg-5 mt-2">
                          <input
                            type="file"
                            id="reportFile"
                            class="form-control"
                            name="reportFile" //report reportFile
                            accept="image/*, .pdf"
                            placeholder="Attach Report"
                            value={fileName}
                            onChange={(e) => {
                              setFileName(e.target.value);
                              setShowFileError(false);
                              handleImage(e);
                            }}
                          />
                          <ErrorMessage
                            error={"Lab report file is required"}
                            visible={showFileError}
                          />
                        </div>
                        <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                          <button
                            type="button"
                            class="addnew"
                            onClick={handleLabReport}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      {reportFiles.length > 0 && (
                        <div id="report" class="mt-3 mb-2 table-responsive">
                          <table className="table table-bordered" width="50%">
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Report Name</th>
                                <th>Attachment</th>
                                <th>Update</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportFiles.map((item) => {
                                console.log(item);
                                return (
                                  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td
                                      onClick={() =>
                                        window.open(item.fileName, "_blank")
                                      }
                                    >
                                      {item.name +
                                        "." +
                                        item.fileName.split(".")[1]}
                                    </td>
                                    <td
                                      onClick={() => handleDeleteReport(item)}
                                    >
                                      {" "}
                                      Delete
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="form-group  mt-2">
                        <input
                          type="text"
                          name="patientnotes"
                          class="form-control"
                          // options={resdata}
                          value={patientNotes}
                          onChange={(e) => setPatientNotes(e.target.value)}
                          placeholder="Notes for Patients"
                          icon={<img src={person} alt="" />}
                        />
                      </div>
                      <div className="form-group  mt-2">
                        <input
                          type="text"
                          name="patientdoctor"
                          class="form-control"
                          // options={resdata}
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                          placeholder="Notes for Doctor"
                          icon={<img src={assignment} alt="" />}
                        />
                      </div>
                      <div className="text-center mt-4">
                        <CustomButton
                          className="btn col-sm-12 col-md-12 col-lg-10"
                          title="Save Consultation"
                          onClick={handleSubmit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <>
                  <Modal
                    className="modalwidth"
                    show={openModel}
                    onHide={() => {
                      setOpenModal(false);
                    }}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Consultation Summary</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div id="modelElement">{summary}</div>
                    </Modal.Body>
                    <Modal.Footer>
                      <CustomButton
                        className="btn"
                        title="Close"
                        onClick={handleClose}
                      />
                    </Modal.Footer>
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

export default StartConsultation;
