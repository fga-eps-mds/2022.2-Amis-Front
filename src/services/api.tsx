/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-template-curly-in-string */
import axios from "axios";
import { getUserLocalStorage } from "./auth";

const userLocalStorage = getUserLocalStorage();

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    Authorization: `Bearer ${userLocalStorage?.token}`,
  },
});

export default api;
