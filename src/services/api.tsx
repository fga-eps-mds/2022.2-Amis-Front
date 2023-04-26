/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-template-curly-in-string */
import axios from "axios";
import { getUserLocalStorage } from "./auth";

const userLocalStorage = getUserLocalStorage();

const api = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${userLocalStorage?.token}`,
  },
});

api.interceptors.request.use((config)=>{
  const token = getUserLocalStorage()?.token;
  const headers = config.headers;
  if(headers) {
    headers.Authorization = `Bearer ${token}`;
    headers.set("Authorization", ); 
  }
  // config.headers.Authorization =  `Bearer ${token}`;
  return config;
});

export default api;
