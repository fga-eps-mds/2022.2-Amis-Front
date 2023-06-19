import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { CursosCadastrarDTO } from "../dtos/CursosCadastrar.dto";

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost("/curso/").reply(201);

export const CadastrarCursoMock = async (payload: CursosCadastrarDTO) => {
  return await api.post("/curso/", payload).then((response: any) => response);
};

export const GetCursoMock = async () => {
  return await api.get("/curso/").then((response: any) => response);
};
