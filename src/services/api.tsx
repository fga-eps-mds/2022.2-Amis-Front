import axios from "axios";
import { getUserLocalStorage } from "./auth";

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_BASE_URL,
});

const userApi = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_USER_URL,
});

const addAuthorizationHeader = (config:any) => {
  const userLocalStorage = getUserLocalStorage();
  config.headers.Authorization = `Bearer ${userLocalStorage?.token}`;
  return config;
};

baseApi.interceptors.request.use(addAuthorizationHeader);
userApi.interceptors.request.use(addAuthorizationHeader);

export { baseApi, userApi };
