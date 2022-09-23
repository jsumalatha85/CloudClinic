import React, { useState } from "react";
import doctorHomePage from "../api/doctorHomePage";
import CustomText from "./common/CustomText";
import Select from "./common/select";

function LabTestTable({ data, onChange, getIntake, getComments }) {
  const [show, setShow] = useState(false);
  const [lab, setLabTest] = useState([]);
  const [labtestName, setLabTestName] = useState([]);
  const [labTestCode, setLabTestCode] = useState("");

  const intake = [
    { id: 1, name: "Before Food" },
    { id: 2, name: "After Food" },
  ];

  const handleSearchLab = async (e) => {
    const value = e.target.value;
    if (value.length >= 3) {
      const res = await doctorHomePage.searchLab(value);
      console.log(res);
      setLabTest(res.data.data);
      setShow(true);
    }
  };

  return (
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
        {data.map((item) => {
          return (
            <tr>
              <td>{item.id}</td>
              <td>
                {" "}
                <input
                  type="text"
                  name="lab"
                  id="lab"
                  class="form-control"
                  // value={labtestName}
                  onChange={handleSearchLab}
                  placeholder="Lab Tests"
                />
                {show &&
                  lab.map((item) => {
                    return (
                      <CustomText
                        onClick={(e) => {
                          setLabTestName([...labtestName, item.lab_test_name]);
                          console.log(labtestName);
                          setLabTestCode(item.name);
                          setShow(false);
                          onChange(item.lab_test_name, item.name);
                        }}
                      >
                        {item.lab_test_name}
                      </CustomText>
                    );
                  })}
              </td>
              <td>
                {" "}
                <Select
                  type="text"
                  name="consumption"
                  id="consumption"
                  class="form-control"
                  options={intake}
                  // value={intakeLab}
                  onChange={(e) => getIntake(e.target.value)}
                  placeholder="Before/After"
                />
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  name="patient"
                  id="patient"
                  class="form-control"
                  // options={resdata}
                  // value={comments}
                  onChange={(e) => getComments(e.target.value)}
                  placeholder="Comments"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default LabTestTable;
