import axios from "axios";
import {API_BASE_URL} from "./Url";

export const Api = async (method, route, data) => {
  const promise = axios({
    method: method,
    url: `${API_BASE_URL}/${route}`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: data,
  });

  return await promise
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        localStorage.clear();
        window.location.replace("/");
        return err.response;
      } else {
        return err.response;
      }
    });
};
