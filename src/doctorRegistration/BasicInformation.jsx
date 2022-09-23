import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";
import doctorRegistrationApi from "../api/doctorRegistration";
import string from "../string";
import AuthContext from "../auth/context";
import storage from "../auth/storage";
import useAuth from "../auth/useAuth";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import CustomForm from "../component/common/CustomForm";
import ErrorMessage from "../component/common/ErrorMessage";
import FormRadioInput from "../component/common/FormRadioInput";
import FormTextInput from "../component/common/FormTextInput";
import ShowMessage from "../component/common/ShowMessage";
import DoctorRegistration from "./DoctorRegistration";
import emailicon from "../assests/svg/email.svg";
import person from "../assests/svg/person.svg";
import photo from "../assests/camera.png";
import work from "../assests/svg/work.svg";

var todayDate = new Date().toISOString().slice(0, 10);

const disablePastDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear() - 1;
  console.log(yyyy + "-" + mm + "-" + dd, "Date");
  return yyyy + "-" + mm + "-" + dd;
};

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().min(3).max(100).label("First Name"),
  lastname: Yup.string().required().min(1).max(100).label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  dob: Yup.date()
    .required()
    .max(todayDate)
    .label("Date Of Birth")
    .test("DOB", "Please choose a valid date of birth", (value) => {
      return (
        moment().diff(moment(value), "years") >= 18 &&
        moment().diff(moment(value), "years") <= 100
      );
    }),
  degree: Yup.string().required().min(2).max(5).label("Degree"),
  yoe: Yup.number()
    .required()
    .positive()
    .min(1)
    .max(99)
    .label("Work Experience"),
  doj: Yup.date()
    .required()
    .min(disablePastDate())
    .max(todayDate)
    .label("Date Of Joining"),
  gender: Yup.string()
    .required()
    .oneOf(["Male", "Female", "Other"])
    .label("Gender"),
});

function BasicInformation(props) {
  const authLogin = useAuth();
  const navigate = useNavigate();
  const { name, lname, email, setName, setLName, setEmail, setScheduleName } =
    useContext(AuthContext);
  const [image, setImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );
  const [showImg, setShowImg] = useState(false);
  const [gender, setGender] = useState();
  const [showimg, setshowimg] = useState("");
  const [degree, setDegree] = useState();
  const [workExp, setWorkExp] = useState();
  const [dojoining, setDojoining] = useState();
  const [dobirth, setDobirth] = useState();
  const [onChangeImage, setonChangeImage] = useState(false);
  const [url, setUrl] = useState();
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

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

  const imageHandler = (e) => {
    try {
      if (
        e.target.files[0].type !== "image/png" &&
        e.target.files[0].type !== "image/jpeg"
      ) {
        setOpen(true);
        setMessage("Kindly upload images ( .png or .jpeg) ");
        setTimeout(() => {
          setOpen(false);
        }, 3000);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setonChangeImage(true);
      setShowImg(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async ({
    firstname,
    lastname,
    dob,
    degree,
    doj,
    yoe,
    gender,
  }) => {
    try {
      // console.log(firstname, lastname, dob, degree, doj, yoe, gender, image);

      if (
        image ===
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      ) {
        setShowImg(true);
        return;
      } else setShowImg(false);
      setLoad(true);
      const id = await storage.getID();
      const fileName = "profile";
      if (onChangeImage) {
        const response = await doctorRegistrationApi.imageUploadProfile(
          fileName,
          image
        );
        console.log("Res", response);
        setUrl(response.data.message.file_url);

        const res1 = await doctorRegistrationApi.updateFile(
          id,
          response.data.message.file_url
        );
        console.log(res1);
      }
      console.log(gender);

      const res = await doctorRegistrationApi.basicInformation(
        id,
        firstname,
        lastname,
        email,
        gender,
        dob,
        degree,
        doj,
        url,
        yoe
      );
      console.log(res, "res");
      await storage.storeId(id, firstname, lastname, email);
      authLogin.logIn(id, firstname, lastname, email);
      navigate("/appointment");
      window.location.reload();
      setLoad(false);
    } catch (error) {
      console.log("Error", error);
      setLoad(false);
    }
  };

  const getBasicInformation = async () => {
    try {
      // setLoad(true);
      const id = await storage.getID();
      console.log(id);
      const res = await doctorRegistrationApi.getDetilsBasicInfo(id);
      console.log(res, "BasicInformation");

      if (res.data.data.practitioner_schedules.length > 0) {
        setScheduleName(res.data.data.practitioner_schedules[0].schedule);
        await storage.storeScheduleName(
          res.data.data.practitioner_schedules[0].schedule
        );
      }
      // setData(res.data.data);
      setName(res.data.data.first_name);
      setLName(res.data.data.last_name);
      setEmail(res.data.data.user_id);
      if (res.data.data.image) {
        setshowimg(string.testbaseUrl + res.data.data.image);
        setImage(string.testbaseUrl + res.data.data.image);
      }

      setDegree(res.data.data.degree);
      if (res.data.data.work_experience === "0") setWorkExp(0);
      else setWorkExp(res.data.data.work_experience);
      setDobirth(res.data.data.date_of_birth);
      setDojoining(res.data.data.date_of_joining);
      setGender(res.data.data.gender);
      // setShow(false);
      if (res.data.data.gender) {
        document.getElementById(res.data.data.gender).checked = true;
      }
      // setLoad(false);
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
      <DoctorRegistration />
      <section>
        <div className="row no-gutters divpd">
          <CustomForm
            initialValues={{
              firstname: name,
              lastname: lname,
              email: email,
              dob: dobirth,
              degree: degree,
              doj: dojoining,
              yoe: workExp,
              gender: gender,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <div className="row no-gutters">
              <div className="col-sm-2 col-md-2 col-lg-2"></div>
              <div className="col-sm-12 col-md-10 col-lg-10">
                <div className="row no-gutters mt-2">
                  <div className="col-sm-2 col-md-2 col-lg-2"></div>
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <div className="pd card shadow mt-4">
                      <h4 className="content-heading mb-2">
                        Basic Information
                      </h4>
                      <input
                        type="file"
                        accept="image/*"
                        name="image-upload"
                        id="input"
                        onChange={imageHandler}
                        style={{ display: "none" }}
                      />
                      <ShowMessage view={open} Message={message} />
                      <div className="label">
                        <img
                          style={{
                            height: 150,
                            width: 150,
                            // objectFit: "cover",
                          }}
                          src={
                            onChangeImage ? image : showimg ? showimg : image
                          }
                          alt=""
                          id="img"
                          className="mb-3 text-center img-thumbnail image-upload"
                          htmlFor="input"
                        />
                        <label className="image-upload  mt-30" htmlFor="input">
                          <img
                            src={photo}
                            alt=""
                            height="40"
                            style={{
                              position: "absolute",
                              marginTop: 15,
                              marginLeft: -20,
                            }}
                          />
                        </label>

                        <ErrorMessage
                          error={"Profile Image is a required field"}
                          visible={showImg}
                        />
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="text"
                            name="firstname"
                            className="mt-30 form-control indent"
                            placeholder="First Name"
                            icon={
                              <img
                                src={person}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="text"
                            name="lastname"
                            className="mt-30 form-control indent"
                            placeholder="Last Name"
                            icon={
                              <img
                                src={person}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <FormTextInput
                            type="email"
                            name="email"
                            className="mt-30 form-control indent"
                            value={email}
                            placeholder="Email"
                            icon={
                              <img
                                src={emailicon}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group row mt-4">
                        <div className="col-sm-12 col-md-8 col-lg-6">
                          <FormTextInput
                            type="text"
                            name="degree"
                            className="mt-30 form-control indent"
                            placeholder="Degree"
                            valChange={(e) => setDegree(e)}
                            icon={
                              <img
                                src={work}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-4">
                        <div className="col-sm-12 col-md-8 col-lg-6">
                          <FormTextInput
                            type="number"
                            name="yoe"
                            className="mt-30 form-control indent"
                            placeholder="Work Experience"
                            icon={
                              <img
                                src={work}
                                alt=""
                                style={{ marginLeft: "4px" }}
                              />
                            }
                          />
                        </div>
                      </div>
                      <div class="form-group row mt-4">
                        <div className="col-sm-12 col-md-8 col-lg-6">
                          <label class="mt-2">Date of Birth</label>
                          <FormTextInput
                            type="date"
                            className="form-control col-sm-12 col-md-8 col-lg-6"
                            name="dob"
                            value={dobirth}
                            placeholder="Date of Birth"
                          />
                        </div>
                      </div>
                      <div class="form-group row mt-4">
                        <label class="mt-2">Date of Joining</label>
                        <div className="col-sm-12 col-md-8 col-lg-6">
                          <FormTextInput
                            type="date"
                            name="doj"
                            className="form-control"
                            value={dojoining}
                            placeholder="Date of Joining"
                          />
                        </div>
                      </div>
                      <div class="form-group row mt-4">
                        <label class="mt-2">Gender</label>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                          <div class="form-group form-check form-check-inline">
                            <FormRadioInput
                              // className="marg_radio"
                              name="gender"
                              data={genderOption}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group row mt-4">
                        <CustomButton
                          className="btn mt-4 col-11 center"
                          type="submit"
                          title=" Next"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-3 col-lg-3 divpd"></div>
          </CustomForm>
        </div>
      </section>
    </>
  );
}

export default BasicInformation;
