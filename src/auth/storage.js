import AsyncStorage from "@react-native-async-storage/async-storage";

const tokenkey = "TOKEN_ID";
const namekey = "NAME";
const lnamekey = "LASTNAME";
const emailkey = "EMAIL";
const docID = "DOCTORID";
const schName = "SCHEDULENAME";
const profilekey = "PROFILECOMPLETE";
const fieldkey = "FIELD";

const storeField = async (field) => {
  try {
    await AsyncStorage.setItem(fieldkey, field);
  } catch (error) {
    console.log("Error storing the Field", error);
  }
};

const storeId = async (id, name, lname, email) => {
  try {
    await AsyncStorage.setItem(docID, id);
    await AsyncStorage.setItem(namekey, name);
    await AsyncStorage.setItem(lnamekey, lname);
    await AsyncStorage.setItem(emailkey, email);
  } catch (error) {
    console.log("Error at store customerid", error);
  }
};

const storeProfileComplete = async (profile) => {
  try {
    await AsyncStorage.setItem(profilekey, profile);
  } catch (error) {
    console.log("Error storing the ProfileComplete", error);
  }
};

const storeScheduleName = async (schedule) => {
  try {
    await AsyncStorage.setItem(schName, schedule);
  } catch (error) {
    console.log("Error storing the ScheduleName", error);
  }
};

const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(tokenkey, token);
  } catch (error) {
    console.log("Error storing the token", error);
  }
};

const getEmail = async () => {
  const email = await AsyncStorage.getItem(emailkey);
  return email ? email : null;
};

const getField = async () => {
  const field = await AsyncStorage.getItem(fieldkey);
  return field ? field : null;
};

const getID = async () => {
  const id = await AsyncStorage.getItem(docID);
  return id ? id : null;
};

const getPageSize = async () => {
  const pageSize = 10;
  return pageSize;
};

const getProfileComplete = async () => {
  const profile = await AsyncStorage.getItem(profilekey);
  return profile ? profile : null;
};

const getScheduleName = async () => {
  const schedule = await AsyncStorage.getItem(schName);
  return schedule ? schedule : null;
};

const getToken = async () => {
  const token = await AsyncStorage.getItem(tokenkey);
  return token ? token : null;
};

const getUser = async () => {
  const name = await AsyncStorage.getItem(namekey);
  return name ? name : null;
};

const removeField = async () => {
  try {
    await AsyncStorage.removeItem(fieldkey);
  } catch (error) {
    console.log("Error removing the Field", error);
  }
};

const removeId = async () => {
  try {
    await AsyncStorage.removeItem(namekey);
    await AsyncStorage.removeItem(emailkey);
    await AsyncStorage.removeItem(docID);
    await AsyncStorage.removeItem(lnamekey);
  } catch (error) {
    console.log("Error at delete customerid", error);
  }
};

const removeProfileComplete = async () => {
  try {
    await AsyncStorage.removeItem(profilekey);
  } catch (error) {
    console.log("Error removing the ProfileComplete", error);
  }
};

const removeScheduleName = async () => {
  try {
    await AsyncStorage.removeItem(schName);
  } catch (error) {
    console.log("Error removing the ScheduleName", error);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(tokenkey);
  } catch (error) {
    console.log("Error removing the token", error);
  }
};

export default {
  storeField,
  storeId,
  storeProfileComplete,
  storeScheduleName,
  storeToken,
  getEmail,
  getField,
  getID,
  getProfileComplete,
  getScheduleName,
  getToken,
  getUser,
  removeField,
  removeId,
  removeProfileComplete,
  removeScheduleName,
  removeToken,
  getPageSize,
};
