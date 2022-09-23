import { create } from "apisauce";
import storage from "../auth/storage";
import string from "../string";

const admintoken = "e7db9c3614ff0de:69597cc198a0ad3";

const apiClient = create({
  baseURL: string.testbaseUrl,
  headers: {
    // Accept: "application/json",
    "Content-Type": "application/json",
    // Authorization: "token " + admintoken,
  },
});
apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await storage.getToken();
  console.log("AuthToken", authToken);

  let token = authToken ? authToken : admintoken;
  // if (!authToken) return;
  request.headers["Authorization"] = "token " + token;
});

export default apiClient;
