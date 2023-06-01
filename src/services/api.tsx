/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-template-curly-in-string */
import axios from "axios";
import { getUserLocalStorage } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const userLocalStorage = getUserLocalStorage();
    config.headers.Authorization = `Bearer ${userLocalStorage?.token}`;
    return config;
  },
  (err) => {
    //console.log(err);
  }
);

export default api;