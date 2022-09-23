import client from "./client";

const basicInformation = async (
  doctorID,
  first_name,
  last_name,
  email,
  gender,
  date_of_birth,
  degree,
  date_of_joining,
  image,
  work_experience
) => {
  const data = await client.put(
    `/api/resource/Healthcare Practitioner/${doctorID}`,
    {
      first_name,
      last_name,
      email,
      gender,
      date_of_birth,
      degree,
      date_of_joining,
      image,
      work_experience,
    }
  );
  return data;
};

const imageUpload = async (docname, filename, filedata) => {
  const data = await client.post("/api/method/upload_file", {
    cmd: "uploadfile",
    doctype: "Healthcare Practitioner",
    docname,
    filename,
    from_form: 1,
    filedata,
  });
  return data;
};
const imageUploadProfile = async (filename, filedata) => {
  const data = await client.post("/api/method/upload_file", {
    cmd: "uploadfile",
    doctype: "File",
    filename,
    from_form: 1,
    filedata,
  });
  return data;
};
const updateFile = async (doctorID, image) => {
  const data = await client.put(
    `/api/resource/Healthcare Practitioner/${doctorID}`,
    {
      image,
    }
  );
  return data;
};

const attachImage = async (doctorID) => {
  const data = await client.get(
    `/api/resource/File?fields=["*"]&filters=[["attached_to_name",
    "=","${doctorID}"],["attached_to_field","!=","image"]]`
  );
  return data;
};

const getDetilsBasicInfo = async (doctorID) => {
  const data = await client.get(
    `/api/resource/Healthcare Practitioner/${doctorID}`
  );
  return data;
};

const getClinicInfo = async (doctorID, op_consulting_charge, hospital) => {
  const data = await client.put(
    `/api/resource/Healthcare Practitioner/${doctorID}`,
    {
      op_consulting_charge,
      hospital,
    }
  );
  return data;
};
const updateFee = async (doctorID, op_consulting_charge) => {
  const data = await client.put(
    `/api/resource/Healthcare Practitioner/${doctorID}`,
    {
      op_consulting_charge,
    }
  );
  return data;
};

const createSchedule = async (schedule_name, time_slots) => {
  console.log(schedule_name);
  const data = await client.post(`/api/resource/Practitioner Schedule`, {
    parent: "Practitioner Schedule",
    schedule_name,
    doctype: "Practitioner Schedule",
    time_slots,
  });
  return data;
};
const createSchedulePut = async (schedule_name, time_slots) => {
  const data = await client.put(
    `/api/resource/Practitioner Schedule/${schedule_name}`,
    {
      parent: "Practitioner Schedule",
      schedule_name,
      doctype: "Practitioner Schedule",
      time_slots,
    }
  );
  return data;
};

const assignSchedule = async (doctorID, schedule) => {
  const data = await client.put(
    `/api/resource/Healthcare Practitioner/${doctorID}`,
    {
      practitioner_schedules: [
        {
          parent: doctorID,
          parentfield: "practitioner_schedules",
          parenttype: "Healthcare Practitioner",
          schedule,
          service_unit: "Cardiology-OPD - B",
          doctype: "Practitioner Service Unit Schedule",
        },
      ],
    }
  );
  return data;
};

const appointmentInfo = async (schedule) => {
  const data = await client.get(
    `/api/resource/Practitioner Schedule/${schedule}`
  );
  return data;
};

const createCompany = async (company_name) => {
  const data = await client.post(`/api/resource/Company`, {
    company_name,
    abbr: company_name,
    domain: "Healthcare",
    default_currency: "INR",
    country: "India",
    default_holiday_list: "Clinic Holiday List",
  });
  return data;
};

const userPermission = async (user, for_value) => {
  const data = await client.post(`/api/resource/User Permission`, {
    user,
    allow: "Company",
    for_value,
    is_default: 1,
  });
  return data;
};

const appointmentSettings = async (
  email,
  company_name,
  op_consulting_charge,
  schedule_name,
  time_slots
) => {
  const data = await client.post(
    "/api/method/erpnext.healthcare.doctype.healthcare_practitioner.api.create_practitioner_schedule",
    {
      email,
      company_name,
      op_consulting_charge,
      schedule_name,
      time_slots,
    }
  );
  return data;
};

export default {
  basicInformation,
  imageUpload,
  imageUploadProfile,
  updateFile,
  attachImage,
  getDetilsBasicInfo,
  getClinicInfo,
  createSchedule,
  createSchedulePut,
  assignSchedule,
  appointmentInfo,
  createCompany,
  userPermission,
  updateFee,
  appointmentSettings,
};
