import qs from "qs";

import request from "./request";
import envVars from "./env-variables";

export default {
  get(endpoint, data) {
    return this.request("get", endpoint, data);
  },

  post(endpoint, data) {
    return this.request("post", endpoint, data);
  },

  put(endpoint, data) {
    return this.request("put", endpoint, data);
  },

  del(endpoint, data) {
    return this.request("del", endpoint, data);
  },

  request(method, endpoint, data) {
    let url = `${envVars.OCEX_API_HOST}${endpoint}`;

    const headers = {
      Accept: "application/json"
    };

    if (method === "get") {
      url += `?${qs.stringify(data)}`;
      return request("get", headers, url);
    } else {
      return request(method, headers, url, data);
    }
  }
};
