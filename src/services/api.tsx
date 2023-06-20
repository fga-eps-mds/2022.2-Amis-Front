import axios from "axios";
import { getUserLocalStorage } from "./auth";


const apiUser = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_BASE_URL_USER,
});

const apiClassroom = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_BASE_URL_CLASSROOM,
});

const apiProduction = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_BASE_URL_PRODUCTION,
});

const addAuthorizationHeader = (config:any) => {
  const userLocalStorage = getUserLocalStorage();
  config.headers.Authorization = `Bearer ${userLocalStorage?.token}`;
  return config;
};

apiUser.interceptors.request.use(addAuthorizationHeader);
apiClassroom.interceptors.request.use(addAuthorizationHeader);
apiProduction.interceptors.request.use(addAuthorizationHeader);

export {apiUser, apiClassroom, apiProduction};
