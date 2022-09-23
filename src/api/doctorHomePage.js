import client from "./client";

const newPatient = async (
  first_name,
  last_name,
  dob,
  sex,
  email,
  mobile,
  blood_group
) => {
  const data = await client.post("/api/resource/Patient", {
    first_name,
    last_name,
    dob,
    sex,
    email,
    mobile,
    blood_group,
    invite_user: 0,
  });
  return data;
};

const patient = async () => {
  const data = await client.get(
    `/api/resource/Patient?fields=["name","patient_name","first_name","email"]&limit_page_length=None`
  );
  return data;
};

const consultationHistory = async (doctorID) => {
  const data = await client.get(
    `/api/resource/Patient Encounter?fields=["name","patient","patient_name","encounter_date","encounter_time"]&filters=[["practitioner","=","${doctorID}"]]&order_by=creation&limit_page_length=None`
  );
  return data;
};

const consultationSummary = async (consultationName) => {
  const data = await client.get(
    `/api/resource/Patient Encounter/${consultationName}`
  );
  return data;
};

const filterDate = async (doctorID, date) => {
  const data = await client.get(
    `/api/resource/Patient Encounter?fields=["name","patient","patient_name",
    "encounter_date","encounter_time"]&filters=[["practitioner","=","${doctorID}"],
    ["encounter_date","=","${date}"]]`
  );
  return data;
};

const filterDateConsultation = async (doctorID, date) => {
  const data = await client.get(
    `/api/resource/Patient Appointment?fields=["name","patient","patient_name","status","appointment_date",
    "appointment_time"]&filters=[["practitioner","=","${doctorID}"],["status","!=",
    "Closed"],["status","!=", "Cancelled"],["appointment_date","=","${date}"]]&order_by=creation  &limit_page_length=None`
  );
  return data;
};

const selectSymptoms = async () => {
  const data = await client.get(`/api/resource/Complaint`);
  return data;
};

const selectDiagnosis = async () => {
  const data = await client.get(`/api/resource/Diagnosis`);
  return data;
};

const searchMedicine = async (search) => {
  const data = await client.get(
    `/api/resource/Item?filters=[["item_group","=", "Drug"],["item_name","like","${search}%"]]&fields=["name","item_name","generic_name"]`
  );
  return data;
};

const getConsumption = async () => {
  const data = await client.get(`/api/resource/Prescription Dosage`);
  return data;
};

const getSlots = async (schedule) => {
  const data = await client.get(
    `/api/resource/Practitioner Schedule/${schedule}`
  );
  return data;
};

const getScheduledSlots = async (doctorID, date) => {
  const data =
    await client.get(`/api/resource/Patient Appointment?fields=["appointment_date",
    "appointment_time"]&filters=[["practitioner","=","${doctorID}"],["status","!=",
    "Closed"],["status","!=", "Cancelled"],["appointment_date","=","${date}"]]`);
  return data;
};

const getDosageForm = async () => {
  const data = await client.get(`/api/resource/Dosage Form`);
  return data;
};

const searchLab = async (search) => {
  const data = await client.get(
    `/api/resource/Lab Test Template?fields=["name","lab_test_name"]&filters=[["lab_test_name","like","${search}%"]]`
  );
  return data;
};

const getAppointmentID = async (patient, date) => {
  const data = await client.get(
    `/api/resource/Patient Appointment?fields=["name"]&filters=[
      ["name","=","${patient}"],["status","!=","Closed"],["status","!=", "Cancelled"],["appointment_date","=","${date}"]]`
  );
  return data;
};

const getDuration = async () => {
  const data = await client.get(`/api/resource/Prescription Duration`);
  return data;
};

const newAppointment = async (
  patient,
  practitioner,
  appointment_date,
  appointment_time
) => {
  const data = client.post(`/api/resource/Patient Appointment`, {
    patient,
    practitioner,
    appointment_date,
    appointment_time,
  });
  return data;
};

const getPatientAppointment = async (appointment) => {
  const data = client.get(
    `/api/resource/Patient Appointment?fields=["name","patient","patient_name","patient_sex","dob","practitioner","practitioner_name"]&filters=[["name",
    "=","${appointment}"]]`
  );
  return data;
};

const patientConsultation = async (
  appointment,
  patient,
  patient_name,
  patient_sex,
  patient_age,
  weight,
  bp,
  practitioner,
  practitioner_name,
  symptoms,
  diagnosis,
  drug_prescription,
  lab_test_prescription,
  notes_for_doctor,
  notes_for_patient
) => {
  const data = client.post(`/api/resource/Patient Encounter`, {
    appointment,
    patient,
    patient_name,
    patient_sex,
    patient_age,
    weight,
    bp,
    practitioner,
    practitioner_name,
    medical_department: "General",
    invoiced: 0,
    symptoms_in_print: 1,
    diagnosis_in_print: 1,
    doctype: "Patient Encounter",
    symptoms,
    diagnosis,
    drug_prescription,
    lab_test_prescription,
    notes_for_doctor,
    notes_for_patient,
  });
  return data;
};

const savePatientConsultation = async (consultationName) => {
  const data = client.put(
    `/api/resource/Patient Encounter/${consultationName}`,
    {
      docstatus: 1,
    }
  );
  return data;
};

const getOpenAppointment = async (doctorID) => {
  const data = client.get(
    `/api/resource/Patient Appointment?fields=["name"]&filters=
    [["practitioner","=","${doctorID}"],["status","!=","Closed"],["status","!=","Cancelled"]]&limit_page_length=None`
  );
  return data;
};

const getAppointment = async (doctorID) => {
  const data = client.get(
    `/api/resource/Patient Appointment?fields=["name","status"]
    &filters=[["practitioner","=","${doctorID}"]]&limit_page_length=None`
  );
  return data;
};

const getPatientDetail = async (mob_name) => {
  const data = client.get(
    `/api/resource/Patient?or_filters=[["mobile","like", "${mob_name}%"],["first_name","like","${mob_name}%"]]
    &fields=["name","first_name","last_name","patient_name","email","mobile","dob","sex"]`
  );
  return data;
};

const getPatientRecord = async (patient) => {
  const data = client.get(
    `/api/resource/Patient Medical Record?filters=[["patient","=","${patient}"]]
    &fields=["name","subject","communication_date"]`
  );
  return data;
};

const getRecord = async (consultationID) => {
  const data = client.get(
    `/api/resource/Patient Medical Record?filters=[["reference_name","=",
    "${consultationID}"]]&fields=["name"]`
  );
  return data;
};

const attachRecord = async (docname, filename, filedata) => {
  const data = client.post(`/api/method/upload_file`, {
    cmd: "uploadfile",
    doctype: "Patient Medical Record",
    docname,
    filename,
    from_form: 1,
    filedata,
  });
  return data;
};

const getReport = async (name) => {
  const data = client.get(
    `/api/resource/File?filters=[["attached_to_name","=","${name}"]]
    &fields=["file_name","file_url"]`
  );
  return data;
};

const getDetails = async (email) => {
  const data = client.post(
    `/api/method/erpnext.healthcare.doctype.healthcare_practitioner.api.homepage_data`,
    {
      email,
    }
  );
  return data;
};

const getAllPatient = async (searchString, limitStart, pageSize) => {
  const data = await client.get(
    `/api/resource/Patient?fields=["name", "first_name", "last_name", "patient_name","email","mobile","dob","sex", "blood_group", "creation"]${searchString}&limit_start=${limitStart}&order_by=creation desc&limit_page_length=${pageSize}`
  );
  return data;
};

const getSearchPatient = async (search) => {
  const data = await client.get(
    `/api/resource/Patient?filters=[["patient_name","like","${search}%"]]&
	fields=["patient_name"]
	&limit_page_length=None`
  );
  return data;
};

const checkOldPatient = async (patientName, email) => {
  const data = await client.get(
    `/api/resource/Patient?fields=["name"]&filters=[["patient_name","=","${patientName}"], ["email","=","${email}"]]&limit_page_length=None`
  );
  return data;
};

const updatePatient = async (
  patientId,
  first_name,
  last_name,
  dob,
  sex,
  email,
  mobile,
  blood_group
) => {
  const data = await client.put(`/api/resource/Patient/${patientId}`, {
    first_name,
    last_name,
    dob,
    sex,
    email,
    mobile,
    blood_group,
  });
  return data;
};

const rescheduleAppointment = async (
  appointmentID,
  appointment_date,
  appointment_time
) => {
  const data = await client.put(
    `api/resource/Patient Appointment/${appointmentID}`,
    {
      appointment_date,
      appointment_time,
    }
  );
  return data;
};
const cancelAppointment = async (appointmentID) => {
  const data = await client.delete(
    `api/resource/Patient Appointment/${appointmentID}`
  );
  return data;
};

const getConsultationName = async (doctorID, appointmentID) => {
  const data = await client.get(
    `/api/resource/Patient Encounter?fields=["name","patient"]&filters=[["practitioner","=","${doctorID}"],
    ["appointment","=","${appointmentID}"]]`
  );
  return data;
};

const appointmentList = async (doctorID, date) => {
  const data = await client.get(
    `/api/resource/Patient Appointment?fields=["name","patient","patient_name","status","appointment_date",
    "appointment_time"]&filters=[["practitioner","=","${doctorID}"],["appointment_date","=","${date}"]]&order_by=creation  &limit_page_length=None`
  );
  return data;
};
export default {
  newPatient,
  patient,
  consultationHistory,
  consultationSummary,
  filterDate,
  filterDateConsultation,
  selectSymptoms,
  selectDiagnosis,
  searchMedicine,
  searchLab,
  patientConsultation,
  newAppointment,
  getAppointmentID,
  getPatientAppointment,
  getConsumption,
  getDuration,
  getDosageForm,
  getSlots,
  getScheduledSlots,
  savePatientConsultation,
  getOpenAppointment,
  getAppointment,
  getPatientDetail,
  getPatientRecord,
  getRecord,
  attachRecord,
  getReport,
  getDetails,
  getAllPatient,
  checkOldPatient,
  getSearchPatient,
  updatePatient,
  rescheduleAppointment,
  cancelAppointment,
  getConsultationName,
  appointmentList,
};
