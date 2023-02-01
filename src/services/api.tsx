/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-template-curly-in-string */
import axios from "axios";
import { getUserLocalStorage } from "./auth";

const userLocalStorage = getUserLocalStorage();

const api = axios.create({
  baseURL: "https://service-amis.azurewebsites.net/",
  headers: {
    Authorization: `Bearer ${userLocalStorage?.token}`,
  },
});

export default api;
