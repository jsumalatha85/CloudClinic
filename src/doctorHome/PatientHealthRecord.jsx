import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import string from "../string";
import doctorHomePage from "../api/doctorHomePage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomForm from "../component/common/CustomForm";
import FormTextInput from "../component/common/FormTextInput";
import ShowMessage from "../component/common/ShowMessage";
import DoctorHome from "./DoctorHome";
import person from "../assests/svg/person.svg";
import phone from "../assests/svg/phone.svg";
import calendar from "../assests/svg/calendar_today.svg";
import gender from "../assests/svg/age-blue.svg";
import emailIcon from "../assests/svg/email.svg";

// const validationSchema = Yup.object().shape({
//   firstname: Yup.string().required().min(3).max(100).label("First Name"),
//   mobile: Yup.string()
//     .required("Mobile Number is Required")
//     .min(10)
//     .max(10)
//     .label("Mobile Number")
//     .matches(
//       /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
//       "Phone number is not valid"
//     ),
// });

function PatientHealthRecord(props) {
  const [patient, setPatient] = useState();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [message, setMessage] = useState("");

  const Myelement = ({ item }) => {
    return (
      <div
        className="table-responsive"
        dangerouslySetInnerHTML={{
          __html: item,
        }}
      ></div>
    );
  };

  const handleSubmit = async ({ name_mobile }) => {
    try {
      setLoad(true);
      setPatient();
      setOpen(false);
      console.log("Check", name_mobile);

      if (!name_mobile) {
        setLoad(false);
        setOpen(true);
        setMessage("Enter the first Name or Mobile Number");
        return;
      }
      // if (!mobile) mobile = firstname;
      // if (!firstname) firstname = mobile;

      const res = await doctorHomePage.getPatientDetail(name_mobile);
      console.log("Patient--", res);

      // const res = await doctorHomePage.getPatientDetail(firstname, mobile);
      // console.log(res, "Patient");
      if (res.data.data.length === 0) {
        setLoad(false);
        setOpen(true);
        setMessage("No records available for the Mobile Number");
        return;
      }
      setPatient(res.data.data);

      let sample1 = [];
      for (let i = 0; i < res.data.data.length; i++) {
        const res1 = await doctorHomePage.getPatientRecord(
          res.data.data[i].name
        );
        console.log(res1, "res1");
        for (let index = 0; index < res1.data.data.length; index++) {
          let sample = [];

          const res2 = await doctorHomePage.getReport(
            res1.data.data[index].name
          );
          console.log(res2, "Report");
          for (let index1 = 0; index1 < res2.data.data.length; index1++) {
            sample = [
              ...sample,
              {
                file_name: res2.data.data[index1].file_name,
                file_url: res2.data.data[index1].file_url,
              },
            ];
          }
          res1.data.data[index] = {
            ...res1.data.data[index],
            sample,
          };
        }
        sample1 = [...sample1, res1.data.data];
        setData(sample1);
        console.log(sample1, "Record");
      }

      setLoad(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

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
              <div className="col-sm-1 col-md-1 col-lg-1"></div>
              <div className="col-sm-10 col-md-10 col-lg-10">
                <div className="pd card shadow mt-4">
                  <h4 className="content-heading">Patient Health Record</h4>
                  <CustomForm
                    initialValues={{
                      name_mobile: "",
                    }}
                    onSubmit={handleSubmit}
                    // validationSchema={validationSchema}
                  >
                    <div className="row form-group mt-3">
                      <div className="col-sm-12 col-md-4 col-lg-4 mt-3">
                        <FormTextInput
                          type="text"
                          name="name_mobile"
                          maxlength="10"
                          className="mt-30 form-control indent "
                          icon={
                            <img
                              src={person}
                              alt=""
                              style={{ marginLeft: "4px" }}
                            />
                          }
                          placeholder="Mobile Number or Name"
                          onClick={() => setOpen(false)}
                        />
                      </div>
                      {/* <div className="col-sm-12 col-md-4 col-lg-4 mt-3">
                        <FormTextInput
                          type="tel"
                          name="mobile"
                          className="mt-30 form-control indent "
                          minlength="10"
                          maxlength="10"
                          // style={{ width: "70%" }}
                          icon={
                            <img
                              src={phone}
                              alt=""
                              style={{ marginLeft: "4px" }}
                              className="input-group-addon"
                            />
                          }
                          placeholder="Enter the Mobile Number"
                          onClick={() => setOpen(false)}
                        />
                      </div> */}
                      <div className="col-sm-12 col-md-4 col-lg-4 mt-3">
                        <CustomButton
                          type="submit"
                          className="btn "
                          title="Search Patient Record"
                        />
                      </div>
                    </div>
                  </CustomForm>
                  <div className="mt-4">
                    <ShowMessage view={open} Message={message} />
                  </div>
                  {patient &&
                    patient.map((item, index) => {
                      const date = item.dob.split("-");
                      const yyyy = date[0];
                      let mm = date[1];
                      let dd = date[2];
                      const selectedDate = dd + "-" + mm + "-" + yyyy;

                      return (
                        <>
                          <div className="p-3 rounded bgColor1 mt-4">
                            <div className="form-group row">
                              <div className="col-2" style={{ width: "50px" }}>
                                <img src={person} atl="" />
                              </div>
                              <div className="col-9">
                                <label className="control-label health_record_lbl">
                                  Patient Name
                                </label>
                                <br />
                                <label className="control-label">
                                  {item.patient_name}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-2" style={{ width: "50px" }}>
                                <img src={gender} atl="" />
                              </div>
                              <div className="col-9">
                                <label className="control-label health_record_lbl">
                                  Gender
                                </label>
                                <br />
                                <label className="control-label">
                                  {item.sex}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-2" style={{ width: "50px" }}>
                                <img src={calendar} atl="" />
                              </div>
                              <div className="col-9">
                                <label className="control-label health_record_lbl">
                                  DOB
                                </label>
                                <br />
                                <label className="control-label">
                                  {selectedDate}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-2" style={{ width: "50px" }}>
                                <img src={phone} atl="" />
                              </div>
                              <div className="col-9">
                                <label className="control-label health_record_lbl">
                                  Mobile
                                </label>
                                <br />
                                <label className="control-label">
                                  {item.mobile}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-2" style={{ width: "50px" }}>
                                <img src={emailIcon} atl="" />
                              </div>
                              <div className="col-9">
                                <label className="control-label health_record_lbl">
                                  E-mail
                                </label>
                                <br />
                                <label className="control-label">
                                  {item.email}
                                </label>
                              </div>
                            </div>
                          </div>
                          {data[index] &&
                            data[index].map((item) => {
                              const date = item.communication_date.split("-");
                              const yyyy = date[0];
                              let mm = date[1];
                              let dd = date[2];
                              const selectedDate = dd + "-" + mm + "-" + yyyy;
                              console.log(selectedDate);
                              return (
                                <div
                                  id="section1"
                                  className="container-fluid mt-4 p-5  rounded bgColor"
                                >
                                  <br />
                                  <div className="form-group row">
                                    <div
                                      className="col-2"
                                      style={{ width: "50px" }}
                                    >
                                      <img src={calendar} atl="" />
                                    </div>
                                    <div className="col-9">
                                      <label className="control-label ">
                                        Visit Date
                                      </label>
                                      <br />
                                      <label className="control-label">
                                        {selectedDate}
                                      </label>
                                    </div>
                                  </div>
                                  <Myelement item={item.subject} />

                                  <div>
                                    {item.sample.length > 0 && (
                                      <>
                                        <h5>Reports : </h5>
                                        {item.sample.map((data) => {
                                          return (
                                            <>
                                              <Link
                                                to=""
                                                className="list-group-item"
                                                onClick={() =>
                                                  window.open(
                                                    string.testbaseUrl +
                                                      data.file_url,
                                                    "_blank"
                                                  )
                                                }
                                              >
                                                {data.file_name}
                                              </Link>
                                            </>
                                          );
                                        })}
                                      </>
                                    )}
                                  </div>
                                  <br />
                                  {/* <hr ></hr> */}
                                </div>
                              );
                            })}
                        </>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PatientHealthRecord;
