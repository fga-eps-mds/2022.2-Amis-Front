import { ErrorResponse } from "@remix-run/router";
import axios from "axios";

export async function LoginRequest(email: string, senha: string): Promise<any> {
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", senha);

    const request = await axios.post(
      import.meta.env.VITE_URL_API_AUTH + "/login/",
      params
    );

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
