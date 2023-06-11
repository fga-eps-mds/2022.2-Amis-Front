import axios from "axios";
import { getUserLocalStorage } from "./auth";

const baseApi = axios.create({
  baseURL: "http://localhost:9090/",
});

const userApi = axios.create({
  baseURL: "http://localhost:9090/",
});

const addAuthorizationHeader = (config:any) => {
  const userLocalStorage = getUserLocalStorage();
  config.headers.Authorization = `Bearer ${userLocalStorage?.token}`;
  return config;
};

baseApi.interceptors.request.use(addAuthorizationHeader);
userApi.interceptors.request.use(addAuthorizationHeader);

export { baseApi, userApi };
