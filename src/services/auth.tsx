import { ErrorResponse } from "@remix-run/router";
import axios from "axios";
import { Roles } from "../context/AuthProvider";
// import api from "./api";

const api = axios.create({
  baseURL: import.meta.env.VITE_AMIS_API_BASE_URL_USER,
});

export async function LoginRequest(
  email: string,
  senha: string,
  role: Roles
): Promise<any> {
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", senha);

    const request = await api.post(`/login/${role}`, params);

    if (request.status === 200) {
      const response = {
        token: request.data.access_token,
      };
      return response;
    }
  } catch (error) {
    // console.log(error);
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new ErrorResponse(401, "Unauthorized", error);
  }
}

export function setUserLocalStorage(user: any) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUserLocalStorage() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}
