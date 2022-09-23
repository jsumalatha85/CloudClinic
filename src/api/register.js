import client from "./client";

const login = async (usr, pwd) => {
  const data = await client.post("/api/method/login", {
    usr,
    pwd,
  });
  return data;
};

const loginApi = async (email, secretpass) => {
  const data = await client.post(
    "/api/method/erpnext.healthcare.doctype.healthcare_practitioner.api.healthcare_practitioner_signin",
    {
      email,
      secretpass,
    }
  );
  return data;
};

const get = async () => {
  const data = client.get("/api/resource/Patient");
  return data;
};

const specialization = async () => {
  const data = client.get("/api/resource/Medical Department");
  return data;
};

const register = async (first_name, last_name, user_id, mobile_phone) => {
  const data = await client.post("/api/resource/Healthcare Practitioner", {
    first_name,
    last_name,
    user_id,
    mobile_phone,
  });
  return data;
};

const registerUser = async (
  first_name,
  last_name,
  email,
  mobile_no,
  new_password
) => {
  const data = await client.post("/api/resource/User", {
    first_name,
    last_name,
    email,
    mobile_no,
    new_password,
    user_type: "System User",
    role_profile_name: "Practitioner Permission",
    api_key: `${email}`,
  });
  return data;
};

const getUserType = async (email) => {
  const data = client.put(`/api/resource/User/${email}`, {
    user_type: "System User",
  });
  return data;
};

const apiSecretKey = async (email) => {
  const data = client.post(
    `/api/method/frappe.core.doctype.user.user.generate_keys?user=${email}`
  );
  return data;
};

const getDocID = async (email) => {
  const data = client.get(
    `/api/resource/Healthcare Practitioner?filters=[["user_id","=","${email}"]]&fields=["name","first_name","last_name","email"]`
  );
  return data;
};

const logout = async () => {
  const data = client.post(`/api/method/logout`);
  return data;
};

const signUp = async (
  email,
  first_name,
  last_name,
  mobile_no,
  new_password
) => {
  const data = client.post(
    "/api/method/erpnext.healthcare.doctype.healthcare_practitioner.api.healthcare_practitioner_signup",
    {
      email,
      first_name,
      last_name,
      mobile_no,
      new_password,
    }
  );
  return data;
};

export default {
  login,
  get,
  register,
  specialization,
  registerUser,
  getUserType,
  apiSecretKey,
  getDocID,
  logout,
  signUp,
  loginApi,
};
