import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { SupervisorDTO } from "../dtos/SupervisorDTO";

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost("/supervisor/").reply(201);

export const CadastrarSupervisorMock = async (payload: SupervisorDTO) => {
  return await api
    .post("/supervisor/", payload)
    .then((response: any) => response);
};

export const GetSupervisorMock = async () => {
  return await api.get("/supervisor/").then((response: any) => response);
};
