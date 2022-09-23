import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import doctorHomePageApi from "../api/doctorHomePage";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomForm from "../component/common/CustomForm";
import FormRadioInput from "../component/common/FormRadioInput";
import FormTextInput from "../component/common/FormTextInput";
import ShowMessage from "../component/common/ShowMessage";
import DoctorHome from "./DoctorHome";
import emailIcon from "../assests/svg/email.svg";
import bloodgroup from "../assests/svg/bloodgroup.svg";
import person from "../assests/svg/person.svg";
import phone from "../assests/svg/phone.svg";
import Select from "../component/common/select";

const disableFutureDate = () => {
  const today = new Date();
  const dd = String(today.getDate() - 1).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  //console.log(yyyy + "-" + mm + "-" + dd, "Date");
  return yyyy + "-" + mm + "-" + dd;
};

const disablePastDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear() - 100;
  //console.log(yyyy + "-" + mm + "-" + dd, "Date");
  return yyyy + "-" + mm + "-" + dd;
};

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().min(3).max(100).label("First Name"),
  lastname: Yup.string().required().min(1).max(100).label("Last Name"),
  dob: Yup.date()
    .required()
    .min(disablePastDate())
    .max(disableFutureDate())
    .label("Date of Birth"),
  email: Yup.string().required().email().label("Email"),
  mobile: Yup.string()
    .required()
    .min(10)
    .max(10)
    .label("Mobile Number")
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Mobile Number is not valid"
    ),
  gender: Yup.string()
    .required()
    .oneOf(["Male", "Female", "Other"])
    .label("Gender"),
});

const genderOption = [
  {
    id: "Male",
    value: "Male",
  },
  {
    id: "Female",
    value: "Female",
  },
  {
    id: "Other",
    value: "Other",
  },
];
const patientBloodGroupOption = [
  {
    id: "",
    name: "Blood Group",
  },
  {
    id: "A Positive",
    name: "A Positive",
  },
  {
    id: "A Negative",
    name: "A Negative",
  },
  {
    id: "AB Positive",
    name: "AB Positive",
  },
  {
    id: "AB Negative",
    name: "AB Negative",
  },
  {
    id: "B Positive",
    name: "B Positive",
  },
  {
    id: "B Negative",
    name: "B Negative",
  },
  {
    id: "O Positive",
    name: "O Positive",
  },
  {
    id: "O Negative",
    name: "O Negative",
  },
];

function NewPatient(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [message, setMessage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dob, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [blood_group, setBloodGroup] = useState([]);
  const [showBloodGroup, setShowBloodGroup] = useState([]);

  const getPatient = async () => {
    if (location.state && location.state.id != "") {
      console.log("state000", location.state);

      setLoad(true);
      const searchString =
        '&filters=[["name","=","' + location.state.id + '"]]';
      console.log(searchString);
      const res1 = await doctorHomePageApi.getAllPatient(
        '&filters=[["name","=","' + location.state.id + '"]]',
        1,
        "none"
      );
      console.log("res1--", res1.data.data[0]);
      document.getElementById(res1.data.data[0].sex).checked = true;

      setFirstname(res1.data.data[0].first_name);
      setLastname(res1.data.data[0].last_name);
      setDOB(res1.data.data[0].dob);
      setEmail(res1.data.data[0].email);
      setMobile(res1.data.data[0].mobile);
      setBloodGroup(res1.data.data[0].blood_group);
      setGender(res1.data.data[0].sex);
    }
    setLoad(false);
  };
  const handleSubmit = async ({
    firstname,
    lastname,
    dob,
    email,
    mobile,
    blood_group,
    gender,
  }) => {
    try {
      setLoad(true);
      if (location.state && location.state.id != "") {
        const res = await doctorHomePageApi.updatePatient(
          location.state.id,
          firstname,
          lastname,
          dob,
          gender,
          email,
          mobile,
          blood_group
        );
        console.log("res--", res);
        setOpen(true);
        setLoad(false);
        setMessage("Patient details updated Successfully");
        return;
      }
      const res1 = await doctorHomePageApi.checkOldPatient(
        firstname + " " + lastname,
        email
      );
      if (res1.data.data.length > 0) {
        setOpen(true);
        setLoad(false);
        setMessage("Already Registered Patient");
        return;
      }
      const res = await doctorHomePageApi.newPatient(
        firstname,
        lastname,
        dob,
        gender,
        email,
        mobile,
        blood_group
      );
      console.log(res);

      if (res.ok === true) {
        setOpen(true);
        setLoad(false);
        setMessage("New Patient Succesfully Added");
        setTimeout(() => {
          setOpen(false);

          navigate("/newpatient");
          window.location.reload();
        }, 3000);
      } else {
        setOpen(true);
        setLoad(false);
        if (res.data.message) setMessage(res.data.message);
        else
          setMessage(
            JSON.parse(JSON.parse(res.data._server_messages)[0]).message
          );
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    getPatient();
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
          <CustomForm
            initialValues={{
              firstname: firstname,
              lastname: lastname,
              dob: dob,
              gender: gender,
              email: email,
              mobile: mobile,
              blood_group: blood_group,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <div className="row no-gutters">
              <div className="col-sm-2 col-md-2 col-lg-2"></div>
              <div className="col-sm-12 col-md-10 col-lg-10">
                <div className="row no-gutters mt-2">
                  <div className="col-sm-2 col-md-2 col-lg-2"></div>
                  <div className="col-sm-6 col-md-6 col-lg-6 mt-4 mb-4">
                    <div className="pd card shadow mt-4">
                      <h4 className="content-heading mb-2">
                        {location.state && location.state.id != ""
                          ? "Update "
                          : "New "}
                        Patient
                      </h4>
                      <ShowMessage view={open} Message={message} />
                      <div className="form-group mt-4">
                        <FormTextInput
                          type="text"
                          name="firstname"
                          value={firstname}
                          className="mt-30 form-control indent"
                          icon={
                            <img
                              src={person}
                              alt=""
                              style={{ marginLeft: "4px" }}
                            />
                          }
                          placeholder="First Name"
                          onClick={() => setOpen(false)}
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </div>
                      <div className="form-group  mt-3">
                        <FormTextInput
                          type="text"
                          value={lastname}
                          name="lastname"
                          className="mt-30 form-control indent"
                          icon={
                            <img
                              src={person}
                              alt=""
                              style={{ marginLeft: "4px" }}
                            />
                          }
                          placeholder="Last Name"
                          onClick={() => setOpen(false)}
                          onChange={(e) => setLastname(e.target.value)}
                        />
                      </div>
                      <div className="form-group mt-4">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="email"
                            name="email"
                            value={email}
                            className="mt-30 form-control indent"
                            icon={
                              <img
                                src={emailIcon}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                            placeholder="Email Address"
                            onClick={() => setOpen(false)}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-12 col-md-12 col-lg-12 mt-3">
                          <FormTextInput
                            type="tel"
                            name="mobile"
                            value={mobile}
                            maxlength="10"
                            className="mt-30 form-control indent"
                            icon={
                              <img
                                src={phone}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                            placeholder="Mobile Number"
                            onClick={() => setOpen(false)}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-12 col-md-12 col-lg-12 mt-2">
                          <Select
                            type="text"
                            name="bloodGroup"
                            className="mt-30 form-control indent"
                            options={patientBloodGroupOption}
                            placeholder="Blood Group"
                            icon={
                              <img
                                src={bloodgroup}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                            value={blood_group}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            visible={showBloodGroup}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="mt-2">Date of Birth</label>
                        <div className="col-sm-12 col-md-7 col-lg-7">
                          <FormTextInput
                            type="date"
                            value={dob}
                            className="form-control mt-1"
                            name="dob"
                            min={disablePastDate()}
                            max={disableFutureDate()}
                            placeholder="Date of Birth"
                            onClick={() => setOpen(false)}
                            onChange={(e) => setDOB(e.target.value)}
                          />
                        </div>
                      </div>

                      <label className="mt-2">Gender</label>

                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className=" form-group form-check form-check-inline">
                          <FormRadioInput
                            name="gender"
                            data={genderOption}
                            onClick={() => setOpen(false)}
                          />
                        </div>
                      </div>
                      <div class=" row ml-3 ml-25">
                        <div className="row text-center btn_center">
                          <CustomButton
                            type="submit"
                            className="btn col-sm-12 col-md-11 col-lg-11 mt-4"
                            title={
                              location.state && location.state.id != ""
                                ? "Update Patient"
                                : "Create Patient"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomForm>
        </div>
      </section>
    </>
  );
}

export default NewPatient;
