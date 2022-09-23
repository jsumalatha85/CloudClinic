import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import storage from "../auth/storage";
import doctorHomePageApi from "../api/doctorHomePage";
import pen from "../assests/svg/pen.svg";
import CustomActivityIndicator from "../component/common/CustomActivityIndicator";
import EmptyComponent from "../component/common/EmptyComponent";
import CustomText from "../component/common/CustomText";
import Pagination from "../component/Pagination";
import DoctorHome from "./DoctorHome";

function PatientList(props) {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitStart, setLimitStart] = useState(0);
  const [searchPatient, setSearchPatient] = useState("");
  const [showPatient, setShowPatient] = useState(false);
  const [searchRes, setSearchRes] = useState([]);
  const [searchString, setSearchString] = useState("");

  const navigate = useNavigate();
  let sno = limitStart + 1;
  const getPatientList = async (limitStart, searchString) => {
    try {
      setLoad(true);
      const pagesize = await storage.getPageSize();
      console.log("pagesize--", pagesize);
      setPageSize(pagesize);
      const allRes = await doctorHomePageApi.getAllPatient(
        searchString,
        1,
        "none"
      );
      console.log("allRes", allRes.data.data.length);
      console.log("limitStart", limitStart);
      console.log("searchString", searchString);
      setTotalCount(allRes.data.data.length);
      const res = await doctorHomePageApi.getAllPatient(
        searchString,
        limitStart,
        pageSize
      );
      console.log("data.length==", res.data.data.length);
      if (res.data.data.length > 0) {
        setData(res.data.data);
      }
      setLoad(false);
    } catch (ex) {
      setLoad(false);
      console.log(ex);
    }
  };
  const handleClick = (patientId) => {
    navigate("/newappointment", { state: { patientId } });
  };
  const handlePageChange = (page) => {
    try {
      setShowPatient(false);
      const lmtst = (page - 1) * pageSize;
      setLimitStart(lmtst);
      setCurrentPage(page);
      console.log("page change searchString==", searchString);
      getPatientList(lmtst, searchString);
    } catch (ex) {
      setLoad(false);
      console.log(ex);
    }
  };
  const handleEditPatient = (id) => {
    console.log("id==", id);
    navigate("/newpatient", { state: { id } });
  };
  const handleSearch = async (value) => {
    //console.log("value === ", value);
    getPatientList(
      limitStart,
      '&filters=[["patient_name","like","' + value + '%"]]'
    );
  };

  const handleSearchPatient = async (e) => {
    try {
      const value = e.target.value;
      setSearchPatient(value);
      if (value.length > 2) {
        const searchRes = await doctorHomePageApi.getSearchPatient(value);
        console.log("searchRes--", searchRes.data.data);
        setSearchRes(searchRes.data.data);
        setShowPatient(true);
        setLimitStart(0);
        //setSearchString('&filters=[["patient_name","like","' + value + '%"]]');
      } else {
        setShowPatient(false);
        setSearchString("");
        getPatientList(limitStart, "");
      }
      setLoad(false);
    } catch (ex) {
      console.log(ex);
      setLoad(false);
    }
  };
  useEffect(() => {
    getPatientList(limitStart, searchString);
  }, []);
  return (
    <>
      <DoctorHome />
      <CustomActivityIndicator
        style={{
          height: 100,
          alignSelf: "center",
        }}
        visible={load}
      />
      <section>
        <div className="row no-gutters mt-225 divpd">
          <div className="row no-gutters">
            <div className="col-sm-2 col-md-2 col-lg-2"></div>
            <div className="col-sm-12 col-md-10 col-lg-10">
              <div className="row no-gutters mt-2">
                <div className="col-sm-1 col-md-1 col-lg-1"></div>
                <div className="col-sm-10 col-md-10 col-lg-10 mt-3 mb-4">
                  <div className="pd card shadow mt-4">
                    <h4 className="content-heading mb-2">Patients List</h4>
                    <div className="row">
                      <div className="form-group p-3 col-12">
                        <input
                          type="text"
                          name="patient"
                          id="patient"
                          class="form-control"
                          value={searchPatient}
                          onChange={handleSearchPatient}
                          placeholder="Patient Name"
                        />
                        <div className="container-sm cstmborder">
                          {showPatient &&
                            searchRes.map((item) => {
                              return (
                                <CustomText
                                  className="dropdown-item"
                                  onClick={(e) => {
                                    setSearchPatient(item.patient_name);
                                    setShowPatient(false);
                                    handleSearch(item.patient_name);
                                  }}
                                >
                                  {item.patient_name}
                                </CustomText>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group ">
                        <div id="report">
                          <div id="report">
                            {data.length > 0 ? (
                              <>
                                <div className="table-responsive theight">
                                  <table className="table table-bordered ">
                                    <thead>
                                      <tr>
                                        <th>S.NO</th>
                                        <th>Name</th>
                                        <th>DOB</th>
                                        <th>Gender</th>
                                        <th>Mobile Number</th>
                                        <th>Email Address</th>
                                        <th>Update</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data.map((item) => {
                                        const date = item.dob.split("-");
                                        const yyyy = date[0];
                                        let mm = date[1];
                                        let dd = date[2];
                                        const selectedDate =
                                          dd + "-" + mm + "-" + yyyy;
                                        return (
                                          <tr key={item.name}>
                                            <td>{sno++}</td>
                                            <td
                                              onClick={() =>
                                                handleClick(item.name)
                                              }
                                              style={{ cursor: "pointer" }}
                                            >
                                              {item.patient_name}
                                            </td>
                                            <td>{selectedDate}</td>
                                            <td>{item.sex}</td>
                                            <td>{item.mobile}</td>
                                            <td>{item.email}</td>
                                            <td className="App pointer">
                                              <img
                                                src={pen}
                                                alt=""
                                                onClick={() =>
                                                  handleEditPatient(item.name)
                                                }
                                              />
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="mt-2">
                                  * Click on patient name to book Appointment
                                </div>
                                <table>
                                  <tbody>
                                    <tr>
                                      <td className="p-3">
                                        <Pagination
                                          itemsCount={totalCount}
                                          pageSize={pageSize}
                                          currentPage={currentPage}
                                          onPageChange={(page) =>
                                            handlePageChange(page)
                                          }
                                          style={{ cursor: "pointer" }}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </>
                            ) : (
                              <EmptyComponent title="No patients added" />
                            )}
                          </div>
                        </div>
                      </div>
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

export default PatientList;
