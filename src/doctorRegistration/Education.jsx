import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorRegistration from "../api/doctorRegistration";
import storage from "../auth/storage";
import string from "../string";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import CustomButton from "../component/common/CustomButton";
import ErrorMessage from "../component/common/ErrorMessage";
import ShowMessage from "../component/common/ShowMessage";
import DoctorRegistration from "./DoctorRegistration";
import fileUpload from "../assests/svg/file_upload.svg";
import pdfLogo from "../assests/pdflogo.jpg";

let base64data;

function Education(props) {
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [load, setLoad] = useState(false);
  const [selectedFiles1, setSelectedFiles1] = useState(fileUpload);
  const [selectedFiles2, setSelectedFiles2] = useState(fileUpload);
  const [selectedFiles3, setSelectedFiles3] = useState(fileUpload);
  const [selectedFiles4, setSelectedFiles4] = useState(fileUpload);
  const [showData1, setShowData1] = useState(false);
  const [showData2, setShowData2] = useState(false);
  const [showData3, setShowData3] = useState(false);
  const [showData4, setShowData4] = useState(false);
  const [fileType1, setFileType1] = useState();
  const [fileType2, setFileType2] = useState();
  const [fileType3, setFileType3] = useState();
  const [fileType4, setFileType4] = useState();
  const [data1, setData1] = useState();
  const [data2, setData2] = useState();
  const [data3, setData3] = useState();
  const [data4, setData4] = useState();
  const [base64, setBase64] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const imageHandler = async (e, value) => {
    try {
      console.log(e.target.files[0].type);
      if (
        e.target.files[0].type !== "image/png" &&
        e.target.files[0].type !== "image/jpeg" &&
        e.target.files[0].type !== "application/pdf"
      ) {
        setOpen(true);
        setMessage("Kindly upload images and pdf files");
        setTimeout(() => {
          setOpen(false);
        }, 3000);
        return;
      }
      console.log(e.target.files[0].type, " upload");

      const filesArray = Array.from(e.target.files).map((file) => ({
        file: URL.createObjectURL(file),
        name: e.target.files[0].name.split(".")[1],
      }));

      const reader = new FileReader();
      var response;
      Array.from(e.target.files).map(async (file) => {
        response = await fetch(URL.createObjectURL(file));
        const imageBlob = await response.blob();
        reader.readAsDataURL(imageBlob);
      });

      reader.onloadend = async () => {
        base64data = reader.result;

        setBase64([...base64, base64data]);
        console.log(base64data.split(";")[0].split("/")[1], "base64data");
        let fileExtension = base64data.split(";")[0].split("/")[1];
        let fileName;
        if (fileExtension === "pdf") {
          fileName = "test.pdf";
          console.log(fileName);
        } else fileName = "test.jpg";
      };

      value === 1
        ? setSelectedFiles1(filesArray)
        : value === 2
        ? setSelectedFiles2(filesArray)
        : value === 3
        ? setSelectedFiles3(filesArray)
        : setSelectedFiles4(filesArray);

      setSelectedFiles([...selectedFiles, ...filesArray]);
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );

      value === 1
        ? setFileType1(e.target.files[0].type.split("/")[1])
        : value === 2
        ? setFileType2(e.target.files[0].type.split("/")[1])
        : value === 3
        ? setFileType3(e.target.files[0].type.split("/")[1])
        : setFileType4(e.target.files[0].type.split("/")[1]);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!data1 && !data2 && !data3 && !data4) {
        if (selectedFiles1 === fileUpload) {
          setShowData1(true);
          return;
        } else setShowData1(false);
        if (selectedFiles2 === fileUpload) {
          setShowData2(true);
          return;
        } else setShowData2(false);
        if (selectedFiles3 === fileUpload) {
          setShowData3(true);
          return;
        } else setShowData3(false);
        if (selectedFiles4 === fileUpload) {
          setShowData4(true);
          return;
        } else setShowData4(false);
        setLoad(true);
        const doctorID = await storage.getID();
        console.log(doctorID);
        console.log("Files", selectedFiles);
        for (let index = 0; index < base64.length; index++) {
          const response = await doctorRegistration.imageUpload(
            doctorID,
            "test." + base64[index].split(";")[0].split("/")[1],
            base64[index]
          );
          console.log("Res", response);
        }
        setLoad(false);
      }
      navigate("/doctorhomepage");
    } catch (error) {
      console.log(error, "Error");
      setLoad(false);
    }
  };

  const getCertificates = async () => {
    try {
      // setLoad(true);
      const doctorID = await storage.getID();
      // console.log(doctorID);
      const res = await doctorRegistration.attachImage(doctorID);
      console.log(res.data.data);
      if (res.data.data.length > 0) {
        setData1(res.data.data[0].file_url);
        setFileType1(res.data.data[0].file_name.split(".")[1]);
        setData2(res.data.data[1].file_url);
        setFileType2(res.data.data[1].file_name.split(".")[1]);
        setData3(res.data.data[2].file_url);
        setFileType3(res.data.data[2].file_name.split(".")[1]);
        setData4(res.data.data[3].file_url);
        setFileType4(res.data.data[3].file_name.split(".")[1]);
      }

      // setLoad(false);
      // var element = document.getElementsById("cert_image");
      // console.log(element);
      // element.class.remove("imageupload");
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    getCertificates();
  }, []);

  return (
    <>
      <CustomActivityIndicator
        style={{ height: 100, alignSelf: "center" }}
        visible={load}
      />
      <DoctorRegistration profile="66.6%" field="1" />
      <section>
        <div className="row no-gutters">
          <div className="col-sm-2 col-md-2 col-lg-2"></div>
          <div className="col-sm-12 col-md-10 col-lg-10">
            <div className="row no-gutters mt-2">
              <div className="col-sm-2 col-md-2 col-lg-2"></div>
              <div className="col-sm-6 col-md-6 col-lg-6">
                <div className="pd card shadow mt-4">
                  <h4 className="content-heading mb-2">Upload Certificates</h4>
                  <ShowMessage view={open} Message={message} />
                  {/* <div className="col-sm-12 col-md-3 col-lg-2 mt-45 divpd text-center"></div> */}
                  <div className="col-sm-12 col-md-12 col-lg-12 mt-2 text-center">
                    <div className="divheight">
                      <h5>ID Proof</h5>
                      <ErrorMessage
                        error={"ID Proof is  required"}
                        visible={showData1}
                      />
                    </div>

                    {data1 ? (
                      <img
                        src={
                          fileType1 === "pdf"
                            ? pdfLogo
                            : string.testbaseUrl + data1
                        }
                        alt=""
                        id="img"
                        className="mb-3 text-center img image-upload"
                        htmlFor="input"
                        height="150"
                        width="150"
                        onClick={() =>
                          window.open(string.testbaseUrl + data1, "_blank")
                        }
                      />
                    ) : (
                      <div className="app image">
                        <div class="imageupload ">
                          <input
                            type="file"
                            id="file1"
                            accept="image/*, .pdf"
                            onChange={(e) => {
                              imageHandler(e, 1);
                              setShowData1(false);
                            }}
                            style={{ display: "none" }}
                          />
                          <div className="label-holder">
                            <label
                              htmlFor="file1"
                              className="label text-center addlbl"
                            >
                              <img
                                src={
                                  fileType1 === "pdf"
                                    ? pdfLogo
                                    : selectedFiles1[0].file
                                    ? selectedFiles1[0].file
                                    : fileUpload
                                }
                                alt=""
                                id="img"
                                className="mb-3 text-center img image-upload"
                                htmlFor="input"
                                height="150"
                                width="150"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-12 mt-2 text-center">
                    <div className="divheight">
                      <h5>E- Signature</h5>
                      <ErrorMessage
                        error={"E- Signature is  required"}
                        visible={showData2}
                      />
                    </div>
                    {data2 ? (
                      <img
                        src={
                          fileType2 === "pdf"
                            ? pdfLogo
                            : string.testbaseUrl + data2
                        }
                        alt=""
                        id="img"
                        className="mb-3 text-center img image-upload"
                        htmlFor="input"
                        height="150"
                        width="150"
                        onClick={() =>
                          window.open(string.testbaseUrl + data2, "_blank")
                        }
                      />
                    ) : (
                      <div className="app image">
                        <div class="imageupload">
                          <input
                            type="file"
                            id="file2"
                            accept="image/*, .pdf"
                            onChange={(e) => {
                              imageHandler(e, 2);
                              setShowData2(false);
                            }}
                            style={{ display: "none" }}
                          />
                          <div className="label-holder">
                            <label
                              htmlFor="file2"
                              className="label text-center addlbl"
                            >
                              <img
                                src={
                                  fileType2 === "pdf"
                                    ? pdfLogo
                                    : selectedFiles2[0].file
                                    ? selectedFiles2[0].file
                                    : fileUpload
                                }
                                alt=""
                                id="img"
                                className="mb-3 text-center img image-upload"
                                htmlFor="input"
                                height="150"
                                width="150"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mt-2 text-center">
                    <div className="divheight">
                      <h5>Degree Certificate</h5>
                      <ErrorMessage
                        error={"Degree Certificate is  required"}
                        visible={showData3}
                      />
                    </div>
                    {data3 ? (
                      <img
                        src={
                          fileType3 === "pdf"
                            ? pdfLogo
                            : string.testbaseUrl + data3
                        }
                        alt=""
                        id="img"
                        className="mb-3 text-center img image-upload"
                        htmlFor="input"
                        height="150"
                        width="150"
                        onClick={() =>
                          window.open(string.testbaseUrl + data3, "_blank")
                        }
                      />
                    ) : (
                      <div className="app image">
                        <div className="imageupload">
                          <input
                            type="file"
                            id="file3"
                            accept="image/*, .pdf"
                            onChange={(e) => {
                              imageHandler(e, 3);
                              setShowData3(false);
                            }}
                            style={{ display: "none" }}
                          />
                          <div className="label-holder">
                            <label
                              htmlFor="file3"
                              className="label text-center addlbl"
                            >
                              <img
                                src={
                                  fileType3 === "pdf"
                                    ? pdfLogo
                                    : selectedFiles3[0].file
                                    ? selectedFiles3[0].file
                                    : fileUpload
                                }
                                alt=""
                                id="img"
                                className="mb-3 text-center img image-upload"
                                htmlFor="input"
                                height="150"
                                width="150"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mt-2 text-center">
                    <div className="divheight">
                      <h5>Medical Council Registration Certificate</h5>
                      <ErrorMessage
                        error={
                          "Medical Council Registration Certificateis  required"
                        }
                        visible={showData4}
                      />
                    </div>
                    {data4 ? (
                      <img
                        src={
                          fileType4 === "pdf"
                            ? pdfLogo
                            : string.testbaseUrl + data4
                        }
                        alt=""
                        id="img"
                        className="mb-3 text-center img image-upload"
                        htmlFor="input"
                        height="150"
                        width="150"
                        onClick={() =>
                          window.open(string.testbaseUrl + data4, "_blank")
                        }
                      />
                    ) : (
                      <div className="app image">
                        <div class="imageupload">
                          <input
                            type="file"
                            id="file4"
                            accept="image/*, .pdf"
                            onChange={(e) => {
                              imageHandler(e, 4);
                              setShowData4(false);
                            }}
                            style={{ display: "none" }}
                          />
                          <div className="label-holder">
                            <label
                              htmlFor="file4"
                              className="label text-center addlbl"
                            >
                              <img
                                src={
                                  fileType4 === "pdf"
                                    ? pdfLogo
                                    : selectedFiles4[0].file
                                    ? selectedFiles4[0].file
                                    : fileUpload
                                }
                                alt=""
                                id="img"
                                className="mb-3 text-center img image-upload"
                                htmlFor="input"
                                height="150"
                                width="150"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mt-2 text-center">
                    <CustomButton
                      className="btn mt-4 col-sm-4 center"
                      type="submit"
                      title=" Submit"
                      onClick={handleSubmit}
                    />
                  </div>
                  <div className="col-sm-12 col-md-3 col-lg-2 mt-45 divpd text-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Education;
