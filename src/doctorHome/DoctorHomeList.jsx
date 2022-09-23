import React from "react";
import LinkGroup from "../component/common/LinkGroup";

function DoctorHomeList(props) {
  return (
    <>
      <LinkGroup to="/newpatient" title="New Patient" />
      <LinkGroup to="/newappointment" title="New Appointment" />
      <LinkGroup to="/upcomingappointment" title="Manage Appointments" />
      <LinkGroup to="/consultationhistory" title="Consultation History" />
      <LinkGroup to="/patientrecord" title="Patient Health Record" />
    </>
  );
}

export default DoctorHomeList;
